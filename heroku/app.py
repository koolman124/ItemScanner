import flask, json, requests
from flask import request, jsonify

app = flask.Flask(__name__)

def productDetails(upc):
    target_product_title, target_product_link, target_product_picture = targetAPI(upc)
    walmart_product_title, walmart_product_link, walmart_product_picture, walmart_relatedItems = walmartAPI(upc)
    product = {}
    if target_product_title:
        product['productTitle'] = target_product_title
    if not product['productTitle'] and walmart_product_title:
        product['productTitle'] = walmart_product_title
    if target_product_picture:
        product['productPic'] = target_product_picture
    if not product['productPic'] and walmart_product_picture:
        product['productPic'] = walmart_product_picture
    product['productLinks'] = [ 
        {
            'store': 'target',
            'link': target_product_link
        },
        {
            'store': 'walmart',
            'link': walmart_product_link
        }
    ]
    return product

def targetAPI(upc):
    target_headers = {
          "user-agent": "Popspedia/28 CFNetwork/978.0.7 Darwin/18.7.0",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US"
        }
    target_api_url = "https://redsky.target.com/v4/products/pdp/BARCODE/{}/3284?key=3f015bca9bce7dbb2b377638fa5de0f229713c78&pricing_context=digital&pricing_store_id=3284"
    r0 = requests.get(target_api_url.format(upc), headers=target_headers)
    try:
        product = r0.json()['products'][0]
        target_product_title = product['title']
        target_product_link = product['targetDotComUri']
        target_product_picture = product['images']['primaryUri']
        return target_product_title, target_product_link, target_product_picture
    except:
        return '','',''

def walmartAPI(upc):
    walmart_headers = {
          "user-agent": "Popspedia/28 CFNetwork/978.0.7 Darwin/18.7.0",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US"
        }
    walmart_api_url = "https://search.mobile.walmart.com/v1/products-by-code/UPC/{}?storeId=3520"
    r0 = requests.get(walmart_api_url.format(upc), headers=walmart_headers)
    try:
        product = r0.json()['data']['common']
        walmart_product_title = product['name']
        walmart_product_link = product['productUrl']
        walmart_product_picture = product['productImageUrl']
        relatedItemsUrl = r0.json()['data']['relatedItemsUrls']['online']
        walmart_relatedItems = walmartRelatedProducts(relatedItemsUrl)
        return walmart_product_title, walmart_product_link, walmart_product_picture, walmart_relatedItems
    except:
        return '','','',[]
    
def walmartRelatedProducts(url):
    walmart_headers = {
          "user-agent": "Popspedia/28 CFNetwork/978.0.7 Darwin/18.7.0",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US"
        }
    query_url = 'https://search.mobile.walmart.com' + url
    r0 = requests.get(query_url, headers=walmart_headers)
    try:
        items = r0.json()['item']
        relatedItems = []
        foundrelatedItems = False
        i = 0
        relatedCount = 0
        while not foundrelatedItems:
            if relatedCount == 3:
                foundrelatedItems = True
            if items[i]['addableToCart']:
                productName = str(items[i]['name']).replace('<mark>', '').replace('</mark>', '')
                relatedItems.append({
                    'productName' : productName,
                    'productImage' : items[i]['productImageUrl'],
                    'productUrl' : items[i]['url']    
                })
                relatedCount += 1
            i += 1
        return relatedItems
    except Exception as e:
        print('Error: ' + str(e))
        return []


@app.route('/', methods=['GET'])
def index():
    return "<h1>Welcome to our server !!</h1>"
    
@app.route('/api/v1/productdetails', methods=['GET'])
def api_all():
    query_parameters = request.args

    upc = query_parameters.get('upc')

    results = productDetails(upc)
    return jsonify(results)

if __name__ == '__main__':
    app.run()
