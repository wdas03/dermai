import os
import time
from urllib.request import urlopen
from bs4 import BeautifulSoup
import json
import boto3
from botocore.exceptions import ClientError

# GLOBAL VARIABLES
CLIENT = boto3.client('dynamodb', region_name='us-east-1',
                      aws_access_key_id=os.environ['AWS_KEY'],
                      aws_secret_access_key=os.environ['AWS_SECRET_KEY']
                      )
DEFAULT_DYNAMO_DB = boto3.resource('dynamodb', region_name='us-east-1',
                                 aws_access_key_id=os.environ['AWS_KEY'],
                                 aws_secret_access_key=os.environ['AWS_SECRET_KEY'])
DEFAULT_TABLE_NAME = 'doctorsInfo'

# INSERT INTO DYNAMO DB FUNCTION
def insert_data(data_list, db=DEFAULT_DYNAMO_DB, table=DEFAULT_TABLE_NAME):
    table = db.Table(table)
    # overwrite if the same index is provided
    for data in data_list:
        #print(data_with_ts)
        response = table.put_item(Item=data)
        time.sleep(0.1)
    print('@insert_data: response', response)
    return response

def scrap_sinai():
    url = "https://doctor.mountsinai.org/find-a-doctor/result?doctor-association=all&epicVisitId=2252&limit=1000&offset=0&search-term=Dermatology&sort=availability&timestamp=2023-11-20T18%3A03%3A53&type=specialty"
    html = urlopen(url)
    bs=BeautifulSoup(html,"html.parser")
    results = bs.find(id="__NEXT_DATA__")
    data = json.loads(results.text)['props']['pageProps']['initialApolloState']

    doctor_records = []
    for key in data.keys():
        if key.startswith('FADResults'):
            if len(data[key]['offices']) > 0:
                if len(data[key]['offices'][0]['schedules']) > 0:
                    doctorInfo = data[key]
                    # Get Doctor Focus list
                    doctor_url = doctorInfo['furl']
                    doctor_html = urlopen(doctor_url+"#clinical")
                    doctor_bs = BeautifulSoup(doctor_html, "html.parser")
                    clinical_focus = doctor_bs.findAll(class_="md:mr-6 mr-3")
                    focus_list = []
                    for focus in clinical_focus:
                        focus_list.append(focus.text.lower())

                    # Build json to be imported
                    doctorRecord = {
                        'doctorId': 'sin_'+doctorInfo['id'],
                        'name': doctorInfo['fullName'],
                        'address1': doctorInfo['offices'][0]['address1'],
                        'address2': doctorInfo['offices'][0]['address2'],
                        'city': doctorInfo['offices'][0]['city'],
                        'state': doctorInfo['offices'][0]['state'],
                        'zip': doctorInfo['offices'][0]['zip'],
                        'phone': doctorInfo['offices'][0]['tel'],
                        'specialties': doctorInfo['specialties'],
                        'availabilities': doctorInfo['offices'][0]['schedules'][0]['allSlots'],
                        'focus': focus_list
                    }
                    doctor_records.append(doctorRecord)

    return doctor_records

def scrap_nyu():
    url = "https://nyulangone.org/api/providers?sort=availability&pageSize=500&page=1&original-criteria=specialist&specialist=dermatologist"
    html = urlopen(url)
    bs=BeautifulSoup(html,"html.parser")
    doctors_json = json.loads(bs.text)
    doctors_list = doctors_json['doctors']
    doctor_records = []
    for doctorInfo in doctors_list:
        doctor_id = doctorInfo['npi']
        focus_list = [condition['title'] for condition in doctorInfo['conditions']]
        doctorRecord = {
            'doctorId': 'nyu_' + doctor_id,
            'name': doctorInfo['fullName'],
            'address1': doctorInfo['locations'][0]['address']['street1'],
            'address2': doctorInfo['locations'][0]['address']['street2'],
            'city': doctorInfo['locations'][0]['address']['city'],
            'state': doctorInfo['locations'][0]['address']['state'],
            'zip': doctorInfo['locations'][0]['address']['zip'],
            'phone': doctorInfo['primaryPhone'][0],
            'specialties': [specialty['specialty'] for specialty in doctorInfo['specialties']],
            'availabilities': doctorInfo['locations'][0]['schedules'][0]['slots'],
            'focus': focus_list
        }
        doctor_records.append(doctorRecord)

    return doctor_records

sinai_doctors = scrap_sinai()
nyu_doctors = scrap_nyu()
insert_response = insert_data(sinai_doctors)
print("FINAL RESPONSE:", insert_response)
insert_response = insert_data(nyu_doctors)
print("FINAL RESPONSE:", insert_response)
