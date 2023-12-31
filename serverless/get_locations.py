import boto3
import os
from boto3.dynamodb.conditions import Key
import json

def lambda_handler(event, context):
    route_id = event['path']['route_id']

    t_locations = os.environ["TABLE_LOCATIONS"]

    # Obtener ubicaciones de la ruta
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(t_locations)

    response = table.query(
        KeyConditionExpression=(Key('route_id').eq(route_id))
    )
    items = response['Items']
    items = list(map((lambda o: json.loads(o['data'])), response['Items']))

    return {
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'data': items
    }
