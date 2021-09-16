import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { metadataService } from '../metadata.service';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { map } from "rxjs/operators";

import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/service.service';
import { Subscription } from 'rxjs';

import * as go from 'gojs';
import * as Jquery from 'jquery';
import { CompileDirectiveMetadata } from '@angular/compiler';
import { isDifferent } from '@angular/core/src/render3/util';
import { NotifierService } from 'angular-notifier';
import { ZoomSlider } from 'src/app/zoomSlider';
import { NgxSpinnerService } from 'ngx-spinner';
import { Optional } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-metaadd-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css'],
})
export class metadataAddItemsComponent implements OnInit {
  myFormGroup: FormGroup;
  // multipleAddForm: FormGroup;

  // formTemplate: any = form_template;
  childOptionsList: any[];
  messageReceived: any;
  private subscriptionName: Subscription;
  private EditsubscriptionName: Subscription;
  listItemMsgReceived: any;
  //declation for go js codes
  myDiagram: any;
  public showDiagram: boolean = false;
  clickedPort: number;
  tabsandElements: any = [];
  selectedTab: any;
  id: any;
  currentModel: any[];
  //end declation for go js codes
  private notifier: NotifierService;
  radioSel: any;
  // radioSelected: string;
  radioSelectedString: string;
  selectedLinkItem;
  devId = [];
  tabId;
  // ----------multiSelect dropdown settings---------

  dropdownList = [];
  selectedItems = [];
  linkList = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    enableCheckAll: false,
    idField: 'opt_id',
    textField: 'opt_value',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  enableButton: boolean = false;

  constructor(
    @Optional() private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private metadataService: metadataService,
    private _location: Location,
    private fb: FormBuilder,
    private http: HttpClient,
    private appService: ServiceService,
    notifier: NotifierService,
    private spinner: NgxSpinnerService
  ) {
    this.ref = ref;
    this.spinner.show();
    this.notifier = notifier;
    this.subscriptionName = this.appService.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      this.messageReceived = message.text;
      this.pageName = this.messageReceived.pageName;
      this.pageId = this.messageReceived.pageID;
      this.eventType = this.messageReceived.EventTypes;
      this.pageType = this.messageReceived.pageType;
      this.elementID = this.messageReceived.elementID;

      if (this.eventType == 'metadata' || this.eventType == 'Add') {
        this.metadataService
          .createPageItems(this.pageId)
          .subscribe((data: any) => {
            this.formElements = data.tabs_list[0].elements_list;
            this.tabId = data.tabs_list[0].tab_id;
            console.log('formElements', this.formElements);
            this.formElements.forEach((input_template) => {
              if (this.myFormGroup != undefined) {
                this.myFormGroup.addControl(
                  input_template.api_param_name,
                  new FormControl('')
                );
              }
            });
          });
      }
      if (this.eventType == 'Add') {
        this.Cleardata();
      }
      if (this.eventType == 'getrecord') {
        this.spinner.show();
        console.log('add-item page edit::' + this.eventType);
        if (this.elementID != undefined) {
          this.GetallElementsByID(this.elementID, this.pageType);
        }
        this.spinner.hide();
      }
    });
    //edit item

    // this.EditsubscriptionName = this.appService
    //   .getUpdate()
    //   .subscribe((message) => {
    //     //message contains the data sent from service
    //     this.listItemMsgReceived = message.text;
    //     this.pageType = this.listItemMsgReceived.pageType;
    //     this.elementID = this.listItemMsgReceived.elementID;
    //     console.log('add-item page edit::' + this.eventType);
    //     // console.log('edit item:' + this.pageType + '-' + this.elementID);
    //     // console.log(this.pageType, this.elementID);
    //     if (this.eventType == 'Add') {
    //       this.Cleardata();
    //     } else {
    //       if (this.elementID != undefined) {
    //         if (this.eventType == 'getrecord') {
    //           this.GetallElementsByID(this.elementID, this.pageType);
    //         }
    //       }
    //     }
    //   });

    this.spinner.hide();

    // this.multipleAddForm = this.fb.group({
    //   quantities: this.fb.array([]),
    // });
  }

  // quantities(): FormArray {
  //   // return this.multipleAddForm.get('quantities') as FormArray;
  // }

  pageType;
  elementID;
  pageId;
  pageName;
  formElements;
  submitAction;
  clickAction;
  deviceDtls;
  radioSelected: any;
  selectedDevices = [];
  SelectedLinks: any = [];
  base64textString: any;

  eventType;
  ngOnInit() {
    this.myFormGroup = new FormGroup({});
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    console.log(item);
  }

  onItemDeSelect(item: any) {
    //     const index = this.selectedItems.indexOf(item);
    // if (index > -1) {
    //   array.splice(index, 1);
    // }

    this.selectedItems.forEach((element) => {
      if (element.opt_id === item.opt_id) {
        const index = this.selectedItems.indexOf(element);
        console.log(index);

        if (index > -1) {
          this.selectedItems.splice(index, 1);
        }
      }
    });
    console.log(item);
  }

  selectID(event: any) {
    let valueExists;
    let id = this.SelectedLinks.indexOf(event.target.id);
    if (this.SelectedLinks.indexOf(event.target.id) !== -1) {
      valueExists = true;
    } else {
      valueExists = false;
    }
    if (event.target.checked && valueExists === false) {
      this.SelectedLinks.push(event.target.id);
    } else {
      this.SelectedLinks.splice(id, 1);
    }

    localStorage.setItem('SelectedLinks', JSON.stringify(this.SelectedLinks));
    // console.log(this.SelectedIDs);
  }

  checked(id) {
    this.SelectedLinks.forEach((element) => {
      //   console.log(element);

      if (element == id) {
        return true;
      }
      return false;
    });
  }

  onDropDownClose() {
    if (this.myFormGroup.controls['TopologyTypeID'].value > 0) {
      console.log('api called ');
      this.devId = [];
      this.selectedDevices = [];
      this.selectedItems.forEach((element) => {
        this.devId.push(element.opt_id);
        this.selectedDevices.push({
          // nename: element.opt_value,
          NEID: element.opt_id,
        });
      });
      let obj = {
        deviceID: this.devId,
        linkTypeID: this.myFormGroup.controls['TopologyTypeID'].value,
      };

      console.log(obj);

      this.metadataService.getLinks(obj).subscribe((arg) => {
        this.linkList = arg.Result;
        console.log(this.linkList);
      });
    } else {
      this.notifier.notify('info', 'Please select Type! ');
      return false;
    }
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  createTopology() {
    // console.log(this.myFormGroup.value);
    console.log(this.SelectedLinks);
    if (!this.SelectedLinks) {
      this.notifier.notify('error', 'Select a link from Topography');
      return false;
    }

    let ObjList = [];
    this.SelectedLinks.forEach((element) => {
      ObjList.push({ ObjectId: element });
    });

    let obj = {
      TopologyTypeID: this.myFormGroup.value.TopologyTypeID,
      TopologyName: this.myFormGroup.value.TopologyName,
      Status: this.myFormGroup.value.status,
      Description: this.myFormGroup.value.Description,
      NEIDList: this.selectedDevices,
      // ObjectType: "Link",
      ObjectIDList: ObjList,
      // TopologyType: this.myFormGroup.value,
      userid: environment.uid,
      orderid: this.myFormGroup.value.orderid,
      // RollOutDate: this.myFormGroup.value,
    };
    console.log('create topology api call ----', JSON.stringify(obj));

    this.formElements.forEach((element) => {
      if (
        element.element_name === 'Finish' &&
        element.element_type === 'button'
      ) {
        this.submitAction = element.element_action;
      }
    });
    this.myFormGroup.value.uid = environment.uid;

    this.metadataService
      .createPageValues(this.submitAction, obj)
      .subscribe((res) => {
        // console.log(res);
        if (res.status == 200) {
          this.RefreshData();
          // alert(res.message);
          this.notifier.notify('success', res.message);
          this.router.navigate([
            '/metadata/list-items',
            { pageName: this.pageName, pageID: this.pageId },
          ]);
          // this.metadataLayoutComponent.changeTab();
        }
        if (res.status == 0) {
          // alert(res.message);
          this.notifier.notify('info', res.message);
          this.router.navigate([
            '/metadata/list-items',
            { pageName: this.pageName, pageID: this.pageId },
          ]);
        }
        if (res.status == 300) {
          // alert(res.message);
          this.notifier.notify('error', res.message);
          //this.router.navigate(["/metadata/list-items", { pageName: this.pageName, pageID: this.pageId }]);
        }
      });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  onSubmit() {
    this.spinner.show();
    // console.log(this.myFormGroup.value);
    this.formElements.forEach((element) => {
      if (
        element.element_name === 'Finish' &&
        element.element_type === 'button'
      ) {
        this.submitAction = element.element_action;
      }
      console.log('image');
      if (element.element_type === 'img') {
        
        console.log(element.api_param_name);
        console.log(this.base64textString);
        
        this.myFormGroup.value.image_upload = this.base64textString;

        //this.myFormGroup.get(element.api_param_name).setValue(this.base64textString);
        //this.myFormGroup.controls[element.api_param_name].value

      }
    });

    this.myFormGroup.value.uid = environment.uid;
    // this.myFormGroup.value.orderid = environment.orderid;

    // console.log('myFormGroup' + JSON.stringify(this.myFormGroup.value));

    this.metadataService
      .createPageValues(this.submitAction, this.myFormGroup.value)
      .subscribe((res) => {
        // console.log(res);
        if (res.status == 200) {
          this.spinner.hide();
          this.RefreshData();
          // alert(res.message);
          this.notifier.notify('success', res.message);
          this.router.navigate([
            '/metadata/list-items',
            { pageName: this.pageName, pageID: this.pageId },
          ]);
        }
        if (res.status == 0) {
          // alert(res.message);
          this.spinner.hide();
          this.notifier.notify('info', res.message);
          this.router.navigate([
            '/metadata/list-items',
            { pageName: this.pageName, pageID: this.pageId },
          ]);
        }
        if (res.status == 300) {
          // alert(res.message);
          this.spinner.hide();
          this.notifier.notify('error', res.message);
          //this.router.navigate(["/metadata/list-items", { pageName: this.pageName, pageID: this.pageId }]);
        }
      });
  }

  customObject = {
    callAddDevice: function () {
      // console.log('called add device');
    },
  };

  onAdd() {
    this.formElements.forEach((element) => {
      if (
        element.element_name === 'Add Device' &&
        element.element_type === 'addButton'
      ) {
        this.clickAction = element.api_param_name;
        this.customObject[this.clickAction]();
      }
    });
  }

  newDevice(): FormGroup {
    return this.fb.group({
      qty: '',
      price: '',
    });
  }

  // addDevice() {
  //   this.quantities().push(this.newDevice());
  // }

  // removeDevice(i: number) {
  //   this.quantities().removeAt(i);
  // }

  onSubmitAdd() {
    // console.log(this.multipleAddForm.value);
  }

  bindChildDropDownList(
    tab_element_id,
    child_element_id,
    event,
    element_action
  ) {
    if (element_action != null) {
      var child_element_Value = event.target.value;
      const selectEl = event.target;

      const selectedVal =
        selectEl.options[selectEl.selectedIndex].getAttribute('data-val');

      // console.log('const val=' + selectedVal);

      if (selectedVal == '') {
        return;
      }
      this.http
        .get(element_action + '/' + child_element_id + '/' + selectedVal)
        .pipe(map((res) => JSON.parse(JSON.stringify(res))))
        .subscribe((data) => {
          if (data.status == 'success')
            this.childOptionsList = data.child_options_list;
          for (let i = 0; i < this.childOptionsList.length; i++) {
            var childObj = this.childOptionsList[i];
            // console.log('val1=' + childObj.tabElementId);
            var element_id = childObj.tabElementId;
            var ElementType = childObj.tabElementType;
            var AtrribName = childObj.tabAtrribName;
            var child_element_options = childObj.tabelement_options;
            // console.log(child_element_options);
            if (ElementType == 1) {
              //  console.log('input');
              let optval = '';
              $.each(child_element_options, function (key, value) {
                optval = value.opt_value;
                //   $("#" + AtrribName.trim()).val(x);
              });
              Object.keys(this.myFormGroup.controls).forEach(
                async (formkey) => {
                  if (AtrribName == formkey) {
                    this.myFormGroup.get(AtrribName).patchValue(optval);
                  }
                }
              );
            }
            if (ElementType == 4) {
              $('#bind' + element_id.trim())
                .find('option')
                .remove();

              $('#bind' + element_id).append(
                $('<option></option>')
                  .attr('value', -1)
                  .attr('selected', 1)
                  .text('Please Select')
              );

              $.each(child_element_options, function (key, value) {
                $('#bind' + element_id).append(
                  $('<option></option>')
                    .attr('value', value.opt_id)
                    .attr('data-val', value.opt_selected_value)
                    .text(value.opt_value)
                );
              });
            }
          }
        });
    }
  }

  discardFunc() {
    // this._location.back();
    //this.RefreshData();
    let url = '/metadata/list-items/' + this.pageName + '/' + this.pageId + '';
    // console.log(url);
    return url;

    // this.router.navigate([
    //   "/metadata/list-items",
    //   { pageName: this.pageName, id: this.pageId },
    // ]);
  }

  async GetallElementsByID(id, type) {
    /*if (
      type == 'Device' ||
      type == 'Shelf' ||
      type == 'Port' ||
      type == 'Card' ||
      type == 'ChildCard' ||
      type == 'Link'
    ) */
      //  console.log('GetallElementsByID id::' + id);
      if (id != 0) {
        await this.metadataService
          .getDeviceDataByID(type, id)
          .subscribe((data: any) => {
            //  console.log('Edit');
            this.deviceDtls = data.Details;
            this.BindItemsInEdit(this.deviceDtls);
          });
      } else {
        this.Cleardata();
      }
    
  }

  async BindItemsInEdit(dataDtls) {
    if (this.myFormGroup != undefined && dataDtls) {
      for (const formkey of Object.keys(this.myFormGroup.controls)) {
        let val = dataDtls[0][formkey];
        this.myFormGroup.get(formkey).setValue(val);
        this.spinner.show();
        for (const input_template of this.formElements) {
          if (input_template.api_param_name == formkey) {
            if (
              input_template.child_elementid != null &&
              input_template.child_elementid != 0
            ) {
              let url =
                input_template.element_action +
                '/' +
                input_template.child_elementid +
                '/' +
                val;
              // console.log(url);
              await this.http
                .get(url)
                .pipe(map((res) => JSON.parse(JSON.stringify(res))))
                .subscribe((data) => {
                  if (data.status == 'success')
                    this.childOptionsList = data.child_options_list;
                  for (let i = 0; i < this.childOptionsList.length; i++) {
                    var childObj = this.childOptionsList[i];
                    var element_id = childObj.tabElementId;
                    var child_element_options = childObj.tabelement_options;

                    $('#bind' + element_id.trim())
                      .find('option')
                      .remove();

                    $('#bind' + element_id).append(
                      $('<option></option>')
                        .attr('value', -1)
                        .attr('selected', 1)
                        .text('Please Select')
                    );

                    $.each(child_element_options, function (key, value) {
                      $('#bind' + element_id).append(
                        $('<option></option>')
                          .attr('value', value.opt_id)
                          .attr('data-val', value.opt_selected_value)
                          .text(value.opt_value)
                      );
                    });
                    // console.log(element_id + ' dropdown');
                    //this.myFormGroup.get(formkey).setValue(val);
                  }
                });
              await this.sleep(500);
              this.myFormGroup.get(formkey).setValue(val);
            }
          }
        }
        await this.sleep(500);
        this.myFormGroup.get(formkey).setValue(val);
        this.spinner.hide();
      }
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  sendMessage(pageDetails): void {
    // send message to subscribers via observable subject
    this.appService.sendUpdate(pageDetails);
  }

  RefreshData() {
    this.linkList = [];
    let elementDetails = {
      pageType: this.pageType,
      elementID: 0,
      pageName: this.pageName,
      pageID: this.pageId,
      EventTypes: 'metadata',
    };
    this.sendMessage(elementDetails);
    localStorage.setItem('pageType', this.pageType);
    localStorage.setItem('elementID', '0');
    localStorage.setItem('pageName', this.pageName);
    localStorage.setItem('pageID', this.pageId);
    this.Cleardata();
  }

  Cleardata() {
    console.log('clear');
    Object.keys(this.myFormGroup.controls).forEach(async (formkey) => {
      this.myFormGroup.get(formkey).setValue('');
    });
  }

  uploadFile(evt) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

  }
  uploadmultiFiles(evt) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
    
  }
  handleReaderLoaded(e) {
    //'data:image/png;base64,' +
    this.base64textString = btoa(e.target.result);
  }
}
