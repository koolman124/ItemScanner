import flask, json, requests
from flask import request, jsonify

app = flask.Flask(__name__)

mobile_headers = {
          "user-agent": "Popspedia/28 CFNetwork/978.0.7 Darwin/18.7.0",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US"
        }

web_headers = {
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
    "cache-control": "no-cache"
}

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

    if not walmart_relatedItems:
        product['relatedItems'] = walmart_relatedItems
    return product

def targetAPI(upc):
    target_api_url = "https://redsky.target.com/v4/products/pdp/BARCODE/{}/3284?key=3f015bca9bce7dbb2b377638fa5de0f229713c78&pricing_context=digital&pricing_store_id=3284"
    r0 = requests.get(target_api_url.format(upc), headers=mobile_headers)
    try:
        product = r0.json()['products'][0]
        target_product_title = product['title']
        target_product_link = product['targetDotComUri']
        target_product_picture = product['images']['primaryUri']
        return target_product_title, target_product_link, target_product_picture
    except:
        return '','',''

def walmartAPI(upc):
    walmart_api_url = "https://search.mobile.walmart.com/v1/products-by-code/UPC/{}?storeId=3520"
    r0 = requests.get(walmart_api_url.format(upc), headers=mobile_headers)
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
    query_url = 'https://search.mobile.walmart.com' + url
    r0 = requests.get(query_url, headers=mobile_headers)
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
                    'store': 'walmart',
                    'productSku' : items[i]['iD']    
                })
                relatedCount += 1
            i += 1
        return relatedItems
    except Exception as e:
        print('Error: ' + str(e))
        return []

def fetchItemInfo(store, sku):
    try:
        upc = ''
        if store == 'target':
            query_url = 'https://redsky.target.com/v2/pdp/tcin/{}?excludes=promotion,taxonomy,bulk_ship,awesome_shop,question_answer_statistics,rating_and_review_reviews,rating_and_review_statistics,deep_red_labels'.format(sku)
            r0 = requests.get(query_url, headers=web_headers)
            item = r0.json()['product']['item']
            upc = item['upc']
        elif store == 'walmart':
            query_url = 'https://www.walmart.com/terra-firma/item/{}'.format(sku)
            r0 = requests.get(query_url, headers=web_headers)
            products = r0.json()['payload']['products']
            for product in products:
                upc = products[product]['upc']
        print(upc)
        return upc
    except Exception as e:
        print('Error: ' + str(e))
        return ''



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
