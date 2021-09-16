import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

let headers = new HttpHeaders();
headers = headers.set('Content-Type', 'application/json; charset=utf-8');

let menuHeaders = new HttpHeaders();
menuHeaders = headers
  .set('Content-Type', 'application/json; charset=utf-8')
  .set('user_role', '1,2,3');

@Injectable({
  providedIn: 'root',
})
export class metadataService {
  constructor(private http: HttpClient) {}

  getDeviceList(pageName): Observable<any> {
    if (pageName == 'Device') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getAllDevice,
        { headers: headers }
      );
    } else if (pageName == 'Shelf') {
      return this.http.get(
        environment.webApiBaseUrl + environment.apiEndPoint.GetShelf,
        { headers: headers }
      );
    } else if (pageName == 'Port') {
      return this.http.get(
        environment.webApiBaseUrl + environment.apiEndPoint.GetPorts,
        { headers: headers }
      );
    } else if (pageName == 'Card' || pageName == 'ChildCard') {
      return this.http.get(
        environment.webApiBaseUrl + environment.apiEndPoint.GetCard,
        { headers: headers }
      );
    } else if (pageName == 'Link') {
      return this.http.get(
        environment.webApiBaseUrl + environment.apiEndPoint.GetLink,
        { headers: headers }
      );
    } else if (pageName == 'Topology') {
      return this.http.get(
        environment.webApiBaseUrl + environment.apiEndPoint.GetTopology,
        { headers: headers }
      );
    } else {
      return this.http.get(
        environment.baseUrl +
          environment.apiEndPoint.getMetaDataDtls +
          '/' +
          pageName,
        { headers: headers }
      );
    }
  }

  getMenuItems(): Observable<any> {
    return this.http.get(
      environment.baseUrl + environment.apiEndPoint.getMenu,
      { headers: menuHeaders }
    );
  }

  createPageItems(id): Observable<any> {
    return this.http.get(
      environment.baseUrl + environment.apiEndPoint.createPage + '/' + id,
      { headers: headers }
    );
  }

  createPageValues(actionLink, data): Observable<any> {
    return this.http.post(actionLink, data, { headers: headers });
  }

  removeData(data, pageName): Observable<any> {
    const httpOptions: any = {
      headers: headers,
    };
    let uri;
    if (pageName == 'Device') {
      uri = environment.webApiBaseUrl + environment.apiEndPoint.removeNE;
    }
    if (pageName == 'Card' || pageName == 'ChildCard') {
      uri = environment.webApiBaseUrl + environment.apiEndPoint.removeCard;
    }
    if (pageName == 'Shelf') {
      uri = environment.webApiBaseUrl + environment.apiEndPoint.removeShelf;
    }
    if (pageName == 'Port') {
      uri = environment.webApiBaseUrl + environment.apiEndPoint.removePort;
    }
    if (pageName == 'Link') {
      uri = environment.webApiBaseUrl + environment.apiEndPoint.removeLink;
    }

    httpOptions.body = data;

    return this.http.request<string>('delete', uri, httpOptions);
  }

  getElementListByID(pageName, id): Observable<any> {
    return this.http.get(
      environment.baseUrl +
        environment.apiEndPoint.getDeviceDtl +
        '/' +
        id +
        '/' +
        pageName,
      { headers: headers }
    );
  }

  getDeviceDataByID(pageName, id): Observable<any> {
    console.log(pageName);
    if (pageName == 'NEType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getNETypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'Bandwidth Type') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getBandwidthTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'Shelf Type') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getShelfTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'SlotType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getSlotTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'CardType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getCardTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'Topology Type') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getTopologyTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'Order Type') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getOrderTypeData + '/' + id,
        { headers: headers }
      );
    }


    if (pageName == 'Location Type') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getLocationTypeData + '/' + id,
        { headers: headers }
      );
    }

    
    if (pageName == 'PortType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getPortTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'LinkType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getLinkTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'Circuit Type') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getCircuitTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'ObjectStatus') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getObjectStatusData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'CustomerType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getCustomerTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'NeTypeShelfType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getNETypeShelfTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'ShelfTypeSlotType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getShelfTypeSlotTypeData + '/' + id,
        { headers: headers }
      );
    }
    
    if (pageName == 'NeTypePortType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getNETypePortTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'CardTypeSlotType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getCardTypeSlotTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'CardTypePortType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getCardTypePortTypeData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'ShelfTypePortType') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.getShelfTypePortTypeData + '/' + id,
        { headers: headers }
      );
    }






















    









    if (pageName == 'Card' || pageName == 'ChildCard') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.GetCardData + '/' + id,
        { headers: headers }
      );
    }

    if (pageName == 'Link') {
      return this.http.get(
        environment.baseUrl + environment.apiEndPoint.GetLinkData + '/' + id,
        { headers: headers }
      );
    }
  }

  getLinks(obj): Observable<any> {
    return this.http.post(
      environment.webApiBaseUrl + environment.apiEndPoint.getLinkByDevId,
      obj,
      {
        headers: headers,
      }
    );
  }
}
