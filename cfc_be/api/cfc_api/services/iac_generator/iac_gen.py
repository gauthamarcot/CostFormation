from aws_cdk import (
    core as cdk,
    aws_ec2 as ec2,
    aws_s3 as s3,
    # ... other AWS CDK modules
)

def iac_generator(service, **kwargs):
    app = cdk.App()
    stack_name = kwargs.pop("stack_name", "MyStack")
    stack = cdk.Stack(app, stack_name)

    if service == "ec2":
        instance_type = kwargs.get("instanceType")
        # ... other EC2 parameters from kwargs

        # Create EC2 instance
        ec2.Instance(stack, "MyEC2Instance",
            instance_type=ec2.InstanceType(instance_type),
            machine_image=ec2.MachineImage.latest_amazon_linux(),
            # ... other EC2 properties
        )

    elif service == "s3":
        # ... S3 parameters from kwargs

        # Create S3 bucket
        s3.Bucket(stack, "MyS3Bucket",
            # ... S3 properties
        )

    # ... add more services here

    # Generate CloudFormation template
    template = app.synth().get_stack_by_name(stack_name).template
    return template