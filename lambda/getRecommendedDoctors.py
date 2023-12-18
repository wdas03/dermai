import json
import boto3
from boto3.dynamodb.conditions import Attr

from opensearchpy import OpenSearch, RequestsHttpConnection, helpers
from requests.auth import HTTPBasicAuth

# Master user credentials
master_username = 'ccbdgroup'
master_password = 'CCBDGroup1!'

# OpenSearch client initialization with master user authentication
opensearch = OpenSearch(
    hosts=[{'host': 'search-doctors-domain-jhukjvozwcmrtu4a3ngi6umdc4.us-east-1.es.amazonaws.com', 'port': 443}],
    http_auth=HTTPBasicAuth(master_username, master_password),
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
    timeout=60  # Increase timeout to 30 seconds
)

def lambda_handler(event, context):
    params = event['queryStringParameters']
    diagnosis = params['diagnosis'].lower()
    
    labels_keywords = {
        'actinic keratoses': [
            'actinic keratoses', "actinic keratosis", "keratosis", "sun", "aging", "skin cancer"
        ],
        'basal cell carcinoma': [
             'basal cell carcinoma', "basal cell cancer", "skin cancer", "mole", "malignant tumor"
        ],
        'benign keratosis-like lesions': [
            "seborrheic keratosis", "skin growth", "epithelial cyst", "tumor", 
            "lesion", "dermal growth"
        ],
        'dermatofibroma': [
            "dermatofibroma", "fibrous histiocytoma", "lesion", "fibroma", "skin fibroma", 
            "cutaneous fibrous tumor", "benign fibroma", "nodule", "dermal tumor"
        ],
        'melanocytic nevi': [
            "melanocytic nevus", "mole", "nevus", "pigmented nevus", "skin mole", 
            "benign nevus", "dysplastic nevus", "mole check", "melanoma screening"
        ],
        'melanoma': [
            "melanoma", "skin cancer", "malignant melanoma", "hyperpigmentation", "malignant tumor", 
            "cutaneous melanoma", "malignant skin lesion", "advanced melanoma", "metastatic melanoma"
        ],
        'vascular lesions': [
            "vascular lesion", "hemangioma", "angiomas", "lesion", "vascular tumor", 
            "blood vessel lesion", "vascular anomaly", "vascular birthmark", "capillary hemangioma", "vasculitis"
        ]
    }

    try:
        # Define the index name
        index_name = "doctor-focus-areas"

        # Prepare the search query for OpenSearch
        search_query = {
            "query": {
                "bool": {
                    "should": [
                        {"match": {"focus_area": word}}
                        for word in labels_keywords[diagnosis]
                    ]
                }
            }
        }

        # Perform the search in OpenSearch
        search_response = opensearch.search(index=index_name, body=search_query)
        
        # Extracting doctor IDs from the search response
        doctor_ids = []
        for hit in search_response['hits']['hits']:
            doctor_ids.extend(hit['_source']['doctor_ids'])

        # Removing potential duplicates
        doctor_ids = list(set(doctor_ids))

        # Fetch doctor details from DynamoDB (if needed)
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('doctorsInfo')
        matching_doctors = []
        for doctor_id in doctor_ids:
            response = table.get_item(Key={'doctorId': doctor_id})
            if 'Item' in response:
                matching_doctors.append(response['Item'])

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(matching_doctors)
        }
    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': str(e)})
        }
    
    # try: 
    #     # Initialize a DynamoDB client
    #     dynamodb = boto3.resource('dynamodb')
    #     table_name = 'doctorsInfo'
    #     table = dynamodb.Table(table_name)
    
    #     # Extract the diagnosis and split it into words
    #     diagnosis = params['diagnosis'].lower()
    
    #     # Define the column name to search in
    #     column_name = 'focus'
    
    #     # List to hold all matching items
    #     matching_items = []
    
    #     # Perform the scan operation for each word in the diagnosis
    #     for word in labels_keywords[diagnosis]:
    #         response = table.scan(
    #             FilterExpression=Attr(column_name).contains(word)
    #         )
    #         items = response.get('Items', [])
    
    #         # Add unique items to the matching items list
    #         for item in items:
    #             if item not in matching_items:
    #                 matching_items.append(item)
    
    #     return {
    #         'statusCode': 200,
    #         'headers': {
    #             'Access-Control-Allow-Headers': '*',
    #             'Access-Control-Allow-Origin': '*',
    #             'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    #         },
    #         'body': json.dumps(matching_items)
    #     }
    # except:
    #     return {
    #         'statusCode': 400,
    #         'headers': {
    #             'Access-Control-Allow-Headers': '*',
    #             'Access-Control-Allow-Origin': '*',
    #             'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    #         }
    #     }
    

# # import json
# # import boto3
# # from boto3.dynamodb.conditions import Attr

# # def lambda_handler(event, context):
# #     params = event['queryStringParameters']
    
# #     # Initialize a DynamoDB client
# #     dynamodb = boto3.resource('dynamodb')

# #     table_name = 'doctorsInfo'
# #     table = dynamodb.Table(table_name)

# #     # Define the keyword to search for in the specified column
# #     # keyword = 'Acne'.lower()
    
# #     keyword = params['diagnosis'].lower()
# #     column_name = 'focus'

# #     # Perform the scan operation with a filter expression
# #     response = table.scan(
# #         FilterExpression=Attr(column_name).contains(keyword)
# #     )

# #     # Extract the items that match the filter criteria
# #     items = response.get('Items', [])
 
# #     return {
# #         'statusCode': 200,
# #         'body': json.dumps(items)
# #     }
