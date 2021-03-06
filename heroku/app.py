import flask
import json
import requests
from flask import request, jsonify
from bs4 import BeautifulSoup as bs

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

barnes_headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D57 SKAVA_NATIVE_IOS SkavaiPhoneApp",
                  "Referer": "https://m.barnesandnoble.com/",
                  "Accept-Language": "en-us",
                  "X-Requested-With": "XMLHttpRequest"}


def productDetails(upc, allergies):
    target_product_title, target_product_link, target_product_picture, target_relatedItems, target_allergies = targetAPI(
        upc, allergies)
    walmart_product_title, walmart_product_link, walmart_product_picture, walmart_relatedItems = walmartAPI(
        upc)
    barnes_product_title, barnes_product_link, barnes_product_picture, barnes_relatedItems = barnesAPI(
        upc)
    product = {}
    try:
        if target_product_title:
            if 'productTitle' not in product:
                product['productTitle'] = target_product_title
        if walmart_product_title:
            if 'productTitle' not in product:
                product['productTitle'] = walmart_product_title
        if barnes_product_title:
            if 'productTitle' not in product:
                product['productTitle'] = barnes_product_title
        if target_product_picture:
            if 'productPic' not in product:
                product['productPic'] = target_product_picture
        if walmart_product_picture:
            if 'productPic' not in product:
                product['productPic'] = walmart_product_picture
        if barnes_product_picture:
            if 'productPic' not in product:
                product['productPic'] = barnes_product_picture
        productLinks = []
        if target_product_link:
            productLinks.append(
                {
                    'store': 'target',
                    'link': target_product_link
                }
            )
        if walmart_product_link:
            productLinks.append(
                {
                    'store': 'walmart',
                    'link': walmart_product_link
                }
            )
        if barnes_product_link:
            productLinks.append(
                {
                    'store': 'barnesandnoble',
                    'link': barnes_product_link
                }
            )

        if productLinks:
            product['productLinks'] = productLinks

        if target_relatedItems:
            if 'relatedItems' not in product:
                product['relatedItems'] = target_relatedItems
            else:
                product['relatedItems'] += target_relatedItems

        if walmart_relatedItems:
            if 'relatedItems' in product:
                product['relatedItems'] += walmart_relatedItems
            else:
                product['relatedItems'] = walmart_relatedItems

        if barnes_relatedItems:
            if 'relatedItems' in product:
                product['relatedItems'] += barnes_relatedItems
            else:
                product['relatedItems'] = barnes_relatedItems

        if target_allergies:
            if 'allergies' not in product:
                product['allergies'] = target_allergies
        else:
            product['allergies'] = []

        if 'productLinks' not in product and 'productTitle' not in product:
            product['Error'] = "Can't find item"

    except:
        product['Error'] = "Can't find item"

    return product


def targetAPI(upc, allergies):
    target_api_url = "https://redsky.target.com/v4/products/pdp/BARCODE/{}/3284?key=3f015bca9bce7dbb2b377638fa5de0f229713c78&pricing_context=digital&pricing_store_id=3284"
    r0 = requests.get(target_api_url.format(upc), headers=mobile_headers)
    try:
        product = r0.json()['products'][0]
        target_product_title = product['title']
        target_product_link = product['targetDotComUri']
        target_product_picture = product['images']['primaryUri']
        target_tcin = product['tcin']
        target_relatedItems = targetRelatedProducts(target_tcin)
        target_allergies = []
        if "nutritionFacts" in product:
            ingredients = product['nutritionFacts']['ingredients']
            ingredients = ingredients.replace(
                ' ', ',').replace('(', '').replace(')', '')
            ingredients = [x.strip()
                           for x in ingredients.lower().split(',')]
            print(ingredients)
            if allergies:
                allergies = [x.lower() for x in allergies.split(',')]
                for allergy in allergies:
                    if allergy in ingredients:
                        print('Found allergy: ' + allergy)
                        target_allergies.append(allergy)
        return target_product_title, target_product_link, target_product_picture, target_relatedItems, target_allergies
    except:
        return '', '', '', [], []


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
        return '', '', '', []


def barnesAPI(upc):
    r0 = requests.get(
        'https://m.barnesandnoble.com/skavastream/core/v5/barnesandnobleapi/productdetails/get?campaignId=1&productids={}'.format(upc), headers=barnes_headers)

    try:
        json_response = json.loads(r0.text)

        product = json_response['children']['products']

        status = product[0]['properties']['buyinfo']['instock']
        barnes_product_title = product[0]['name']
        barnes_product_picture = product[0]['image']
        # if status == 'true':
        barnes_product_link = 'https://www.barnesandnoble.com/w/jarman/123?ean={}'.format(
            upc)
        barnes_relatedItems = barnesRecommended(upc)
        return barnes_product_title, barnes_product_link, barnes_product_picture, barnes_relatedItems
    except:
        return '', '', '', []


def barnesRecommended(upc):
    r0 = requests.get(
        'https://m.barnesandnoble.com/skavastream/marketing/v5/barnesandnobleapi/recommendation/alsobought?campaignId=1&productids={}'.format(upc), headers=barnes_headers)

    try:
        json_response = json.loads(r0.text)

        products = json_response['children']['alsobought']
        relatedItems = []
        for product in products:
            relatedItems.append({
                'productName': product['name'],
                'productImage': product['image'],
                'store': 'barnesandnoble',
                'productSku': product['identifier']
            })
        return relatedItems
    except:
        return []


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
            if relatedCount == 2:
                foundrelatedItems = True
            if items[i]['addableToCart']:
                productName = str(items[i]['name']).replace(
                    '<mark>', '').replace('</mark>', '')
                relatedItems.append({
                    'productName': productName,
                    'productImage': items[i]['productImageUrl'],
                    'store': 'walmart',
                    'productSku': items[i]['iD']
                })
                relatedCount += 1
            i += 1
        return relatedItems
    except Exception as e:
        print('Error: ' + str(e))
        return []


def targetRelatedProducts(sku):
    query_url = 'https://redsky.target.com/recommended_products/v1?tcins={}&placement_id=adaptpdph1&pricing_store_id=3284&store_id=3284&purchasable_store_ids=3284%2C3249%2C3229%2C2850%2C3321&visitor_id=017031967BE90201B2A1FC53191E7DF5&key=eb2551e4accc14f38cc42d32fbc2b2ea'.format(
        sku)
    r0 = requests.get(query_url, headers=web_headers)
    try:
        items = r0.json()['products']
        relatedItems = []
        foundrelatedItems = False
        i = 0
        relatedCount = 0
        while not foundrelatedItems:
            if relatedCount == 3:
                foundrelatedItems = True
            if items[i]['availability_status'] == 'IN_STOCK':
                relatedItems.append({
                    'productName': items[i]['title'],
                    'productImage': items[i]['primary_image_url'],
                    'store': 'target',
                    'productSku': items[i]['tcin']
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
            query_url = 'https://redsky.target.com/v2/pdp/tcin/{}?excludes=promotion,taxonomy,bulk_ship,awesome_shop,question_answer_statistics,rating_and_review_reviews,rating_and_review_statistics,deep_red_labels'.format(
                sku)
            r0 = requests.get(query_url, headers=web_headers)
            item = r0.json()['product']['item']
            upc = item['upc']
        elif store == 'walmart':
            query_url = 'https://www.walmart.com/terra-firma/item/{}'.format(
                sku)
            r0 = requests.get(query_url, headers=web_headers)
            products = r0.json()['payload']['products']
            for product in products:
                upc = products[product]['upc']
        elif store == 'barnesandnoble':
            upc = sku
        return upc
    except Exception as e:
        print('Error: ' + str(e))
        return ''


def combineQueries(query):
    target_query = queryTarget(query)
    walmart_query = queryWalmart(query)

    return target_query + walmart_query


def queryTarget(query):
    try:
        query_url = 'https://redsky.target.com/v4/products/list/3284?key=3f015bca9bce7dbb2b377638fa5de0f229713c78&limit=10&pageNumber=1&pricing_context=digital&pricing_store_id=3284&searchTerm={}'
        r0 = requests.get(query_url.format(query), headers=mobile_headers)
        query_products = r0.json()['products']
        products = []
        for product in query_products:
            products.append({
                'productName': product['title'],
                'productImage': product['images']['primaryUri'],
                'productUpc': product['upc']
            })
        return products
    except Exception as e:
        print('Error: ' + str(e))
        return []


def queryWalmart(query):
    try:
        preso_headers = {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
            "cache-control": "no-cache",
            "content-type": "application/json"
        }
        query_url = 'https://www.walmart.com/preso/search?sort=best_match&page=1&prg=mWeb&cat_id=4171&preciseSearch=true&soft_sort=true&assetProtocol=secure&query={}'
        r0 = requests.get(query_url.format(query), headers=preso_headers)
        query_products = r0.json()['items']
        products = []
        for product in query_products:
            productName = str(product['title']).replace(
                '<mark>', '').replace('</mark>', '')
            if product['inventory']['availableOnline'] == True and 'upc' in product:
                upc = fetchItemInfo('walmart', product['productId'])
                products.append({
                    'productName': productName,
                    'productImage': product['imageUrl'],
                    'productUpc': upc
                })
        return products
    except Exception as e:
        print('Error: ' + str(e))
        return []


def targetInstore(sku, zip):
    url = 'https://api.target.com/available_to_promise/v2/{}/search?key=eb2551e4accc14f38cc42d32fbc2b2ea&nearby={}&field_groups=location_summary&multichannel_option=none&inventory_type=stores&requested_quantity=1&radius=250'.format(
        sku, zip)
    print(url)

    response = requests.get(url, headers=web_headers)

    stores = response.json()['products'][0]['locations']
    instock_stores = []
    for store in stores:
        if store['availability_status'] == 'IN_STOCK':
            response = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
                                    store['store_address'] + '&key=XXXXXXXXXXXXXXXXXXXXXXXs')
            instock_stores.append(
                {
                    'store_name': store['store_name'],
                    'store_address': store['store_address'],
                    'store_coords': response.json()['results'][0]['geometry']['location']
                }
            )

    return instock_stores


def bestBuyinstorestock(sku, zip):
    bestbuy_headers = {
        'authority': 'www.bestbuy.com',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'content-type': 'application/json',
        'origin': 'https://www.bestbuy.com',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'accept-language': 'en-US,en;q=0.9'
    }

    data = '{"locationId":"30","zipCode":"%s","showOnShelf":true,"lookupInStoreQuantity":false,"xboxAllAccess":false,"consolidated":false,"items":[{"sku":"%s","condition":null,"quantity":1,"itemSeqNumber":"1","reservationToken":null,"selectedServices":[],"requiredAccessories":[],"isTradeIn":false}]}' % (
        zip, sku)

    response = requests.post(
        'https://www.bestbuy.com/productfulfillment/c/api/2.0/storeAvailability', headers=bestbuy_headers, data=data)
    return response.text


def grabTerraFirma(stores, SKU):
    headers = {
        'pragma': 'no-cache',
        'content-type': 'application/json',
        'accept': '*/*',
        'cache-control': 'no-cache',
        'authority': 'www.walmart.com',
        'referer': 'https://www.walmart.com/product/{}/sellers'.format(SKU),
    }

    params = (
        ('rgs', 'OFFER_PRODUCT,OFFER_INVENTORY,OFFER_PRICE,VARIANT_SUMMARY'),
    )

    data = '{{"itemId":"{}","paginationContext":{{"selected":false}},"storeFrontIds":{}}}'.format(
        SKU, stores)

    response = requests.post('https://www.walmart.com/terra-firma/fetch',
                             headers=headers, params=params, data=data, timeout=10)
    offers = response.json()['payload']['offers']

    nearby_stores = []
    try:
        for element in offers:
            if offers[element]['sellerId'] == 'F55CDC31AB754BB68FE0B39041159D63':
                nearby_stores = offers[element]['fulfillment']['pickupOptions']
    except:
        pass

    instock_stores = []

    if nearby_stores:
        for store in nearby_stores:
            if store['availability'] == 'AVAILABLE' and store['inStoreStockStatus'] == 'In stock':
                store_address = store['storeAddress'] + ', ' + store['storeCity'] + \
                    ', ' + store['storeStateOrProvinceCode'] + \
                    ' ' + store['storePostalCode']
                response = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
                                        store_address + '&key=XXXXXXXXXXXXXXXXXXXX')
                instock_stores.append(
                    {
                        'store_name': store['storeName'],
                        'store_address': store_address,
                        'store_coords': response.json()['results'][0]['geometry']['location']
                    }
                )

    return instock_stores


def walmartInstore(sku, zip):
    response = requests.get(
        'https://www.walmart.com/store/finder/electrode/api/stores?singleLineAddr={}&distance=25'.format(zip, headers=web_headers))
    stores = response.json()['payload']['storesData']['stores']

    post_stores = []

    for store in stores:
        post_stores.append(
            {
                "usStoreId": store['id'],
                "preferred": False,
                "semStore": False
            }
        )

    return grabTerraFirma(json.dumps(post_stores), sku)


def barnesInstore(sku, zip):
    barnes_store_headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'upgrade-insecure-requests': '1'
    }
    response = requests.get(
        'https://www.barnesandnoble.com/xhr/storeList-with-prodAvailability.jsp?action=fromSearch&radius=25&searchString={0}&skuId={1}'.format(zip, sku), headers=web_headers)
    soup = bs(response.text, "lxml")
    stores = soup.findAll('div', {'class': 'store-list ml-s mr-s mt-ss'})
    instock_stores = []

    for store in stores:
        instock_status = store.find('p', {'aria-label': 'In Stock in Store'})
        if instock_status:
            addy = store.find(
                'div', {'class': 'swift-left mr-ss store-address'})
            # print(addy.text)
            store_info = addy.findAll('p', {'class': 'mt-0 mb-0'})
            city_zip = addy.find('p', {'class': 'mt-0 mb-xs'}).text
            # print(len(store_info))
            if len(store_info) > 1:
                store_name = store_info[0].text
                store_address = store_info[1].text + ' ' + city_zip
            elif len(store_info) == 1:
                store_name = store_info[0].text
                store_address = store_info[0].text + ' ' + city_zip

            store_address = store_address.replace("\n", " ")

            response = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
                                    store_address + '&key=XXXXXXXXXXX')
            instock_stores.append(
                {
                    'store_name': store_name,
                    'store_address': response.json()['results'][0]['formatted_address'],
                    'store_coords': response.json()['results'][0]['geometry']['location']
                }
            )

    return instock_stores


@app.route('/', methods=['GET'])
def index():
    return "<h1>Welcome to our server !!</h1>"


@app.route('/api/v1/productdetails', methods=['GET'])
def api_all():
    query_parameters = request.args

    upc = query_parameters.get('upc')
    allergies = query_parameters.get('userAllergies')

    results = productDetails(upc, allergies)
    return jsonify(results)


@app.route('/api/v1/productinfo', methods=['GET'])
def api_sku():
    query_parameters = request.args

    store = query_parameters.get('store')
    sku = query_parameters.get('sku')
    allergies = query_parameters.get('userAllergies')

    upc = fetchItemInfo(store, sku)
    results = productDetails(upc, allergies)
    return jsonify(results)


@app.route('/api/v1/products/list', methods=['GET'])
def api_query():
    query_parameters = request.args

    query = query_parameters.get('searchTerm')

    products = combineQueries(query)
    return jsonify(products)


@app.route('/api/v1/productinfo/nearby', methods=['GET'])
def api_nearby():
    query_parameters = request.args

    store = query_parameters.get('store')
    sku = query_parameters.get('sku')
    postal_code = query_parameters.get('postal_code')

    if store == 'target':
        instore_stores = targetInstore(sku, postal_code)
    if store == 'walmart':
        instore_stores = walmartInstore(sku, postal_code)
    if store == 'barnesandnoble':
        instore_stores = barnesInstore(sku, postal_code)

    return jsonify(instore_stores)


if __name__ == '__main__':
    app.run()
