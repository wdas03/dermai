import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    params = json.loads(event['body'])
    
    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    # Reference the 'doctorsInfo' table
    table = dynamodb.Table('doctorsInfo')

    # Extract 'doctor_id' from the event
    doctor_id = params.get('doctor_id')

    try:
        # Query the table
        response = table.get_item(
            Key={
                'doctorId': doctor_id
            }
        )

        # Check if the item was found
        if 'Item' in response:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps(response['Item'])
            }
        else:
            # Doctor ID not found
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps({'error': 'Doctor ID not found'})
            }

    except ClientError as e:
        # Handle potential errors
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': 'Internal server error'})
        }
