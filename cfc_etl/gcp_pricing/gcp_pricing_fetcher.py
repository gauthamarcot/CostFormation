import logging
from datetime import datetime
from typing import Dict, List, Optional
import pandas as pd
import requests
from pymongo import MongoClient
from pymongo.errors import BulkWriteError
import os
from dotenv import load_dotenv
from google.cloud import billing_v1
from google.cloud import bigquery
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class GCPPricingFetcher:
    def __init__(self):
        load_dotenv()
        self.mongo_uri = os.getenv('MONGODB_URI')
        self.client = MongoClient(self.mongo_uri)
        self.gcp_pricing_db = self.client["cfc_gcp_pricing_db"]
        self.main_db = self.client["cfc_db"]
        self.main_collection = self.main_db["gcp_pricing_meta"]
        
        # GCP configuration
        self.project_id = os.getenv('GCP_PROJECT_ID')
        self.billing_account_id = os.getenv('GCP_BILLING_ACCOUNT_ID')
        
        # Initialize GCP clients
        self.billing_client = billing_v1.CloudBillingClient()
        self.bigquery_client = bigquery.Client()
        
    def _get_service_catalog(self) -> List[Dict]:
        """Get GCP service catalog with pricing information."""
        try:
            catalog = self.billing_client.list_services()
            return list(catalog)
        except Exception as e:
            logger.error(f"Error fetching service catalog: {str(e)}")
            return []
    
    def _get_sku_pricing(self, service_id: str) -> List[Dict]:
        """Get SKU pricing information for a service."""
        try:
            skus = self.billing_client.list_skus(
                parent=f"services/{service_id}",
                currency_code="USD"
            )
            return list(skus)
        except Exception as e:
            logger.error(f"Error fetching SKUs for service {service_id}: {str(e)}")
            return []
    
    def _process_sku_data(self, sku: Dict) -> Dict:
        """Process SKU data into standardized format."""
        try:
            return {
                'service_id': sku.service,
                'sku_id': sku.sku_id,
                'description': sku.description,
                'category': sku.category.resource_family,
                'resource_group': sku.category.resource_group,
                'usage_type': sku.category.usage_type,
                'pricing_info': [
                    {
                        'price': pricing_info.pricing_expression.tiered_rates[0].unit_price.units,
                        'currency': pricing_info.pricing_expression.tiered_rates[0].unit_price.currency_code,
                        'region': pricing_info.pricing_expression.tiered_rates[0].unit_price.region_code
                    }
                    for pricing_info in sku.pricing_info
                ],
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error processing SKU data: {str(e)}")
            return {}
    
    def _save_to_mongodb(self, collection_name: str, data: List[Dict]) -> bool:
        """Save data to MongoDB with error handling."""
        try:
            collection = self.gcp_pricing_db[collection_name]
            result = collection.insert_many(data, ordered=False)
            logger.info(f"Successfully inserted {len(result.inserted_ids)} documents into {collection_name}")
            return True
        except BulkWriteError as bwe:
            logger.error(f"Bulk write error in {collection_name}: {bwe.details}")
            return False
        except Exception as e:
            logger.error(f"Error saving to MongoDB {collection_name}: {str(e)}")
            return False
    
    def _save_to_csv(self, service: str, data: List[Dict]) -> bool:
        """Save data to CSV file."""
        try:
            df = pd.DataFrame(data)
            filepath = f"cfc_etl/data/gcp_{service}_data_{datetime.now().strftime('%Y%m%d')}.csv"
            df.to_csv(filepath, index=False)
            logger.info(f"Successfully saved data to {filepath}")
            return True
        except Exception as e:
            logger.error(f"Error saving to CSV for {service}: {str(e)}")
            return False
    
    def fetch_pricing_data(self) -> None:
        """Main method to fetch and process GCP pricing data."""
        try:
            # Get service catalog
            services = self._get_service_catalog()
            
            for service in services:
                service_id = service.name.split('/')[-1]
                logger.info(f"Processing service: {service_id}")
                
                # Get SKUs for the service
                skus = self._get_sku_pricing(service_id)
                
                # Process and save SKU data
                processed_data = []
                for sku in skus:
                    processed_sku = self._process_sku_data(sku)
                    if processed_sku:
                        processed_data.append(processed_sku)
                
                if processed_data:
                    self._save_to_mongodb(f"{service_id}_pricing", processed_data)
                    self._save_to_csv(service_id, processed_data)
                    
        except Exception as e:
            logger.error(f"Fatal error in fetch_pricing_data: {str(e)}")
        finally:
            self.client.close()

if __name__ == '__main__':
    fetcher = GCPPricingFetcher()
    fetcher.fetch_pricing_data() 