import json
import boto3
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    params = event['queryStringParameters']
    
    # Initialize a DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    table_name = 'doctorsInfo'
    table = dynamodb.Table(table_name)

    # Define the keyword to search for in the specified column
    # keyword = 'Acne'.lower()
    
    keyword = params['diagnosis'].lower()
    column_name = 'focus'

    # Perform the scan operation with a filter expression
    response = table.scan(
        FilterExpression=Attr(column_name).contains(keyword)
    )

    # Extract the items that match the filter criteria
    items = response.get('Items', [])
 
    return {
        'statusCode': 200,
        'body': json.dumps(items)
    }
