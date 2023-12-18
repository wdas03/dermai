import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')

def query_appointments(doctor_id, table_name):
    table = dynamodb.Table(table_name)
    try:
        response = table.query(
            IndexName='doctorId-appointmentTime-index',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('doctorId').eq(doctor_id)
        )
        return response.get('Items', [])
    except ClientError as e:
        print(f"An error occurred: {e.response['Error']['Message']}")
        return []

def query_patient(patient_email, patients_table_name):
    table = dynamodb.Table(patients_table_name)
    try:
        response = table.get_item(Key={'email': patient_email})
        return response.get('Item')
    except ClientError as e:
        print(f"An error occurred: {e.response['Error']['Message']}")
        return None

def lambda_handler(event, context):
    # Parse doctorId from the event body
    try:
        params = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        doctor_id = params['doctorId']
    except (KeyError, TypeError, json.JSONDecodeError) as e:
        print(f"Error parsing event body: {e}")
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Invalid request'})
        }
    
    try: 
        # Query the appointments from DynamoDB
        appointments = query_appointments(doctor_id, 'appointments')
    
        # Add patient information to each appointment
        for appointment in appointments:
            patient_info = query_patient(appointment['patientEmail'], 'patients')
            if patient_info:
                appointment['patientInfo'] = patient_info
    
        # Return the result
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(appointments)
        }
    except:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': 'Internal server error'})
        }
