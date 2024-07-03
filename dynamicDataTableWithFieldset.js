import { LightningElement, wire, track } from 'lwc';
import getAccount from '@salesforce/apex/AccountControllerFieldSet.getAccountList';
import getFieldDetails from '@salesforce/apex/AccountControllerFieldSet.getFieldDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DynamicDataTableWithFieldset extends LightningElement {

    haveFieldSet = false;
    @track columns;
    @track cdata;

    connectedCallback() {
        this.setColumns();
    }
    @wire(getAccount)
    accountData({ data, error }) {
        if (data) {
            this.cdata = data;
            console.log('Data '+JSON.stringify(this.cdata));
        }
        else if (error) {
            console.log('Error '+JSON.stringify(error));
            this.showError(error);
        }
    }
    setColumns() {
        getFieldDetails()
            .then((data) => {
                console.log('fieldSet '+JSON.stringify(data));
                //let fieldSet = JSON.stringify(data);
                //console.log('fieldSet parse '+fieldSet);
               
                //this.columns = [...fieldSet.map((field) => ({ label: Object.keys(field)[0], fieldName: Object.values(field)[0], }))];
                this.columns = [...Object.keys(data).map(key => ({
                        label: key,
                        fieldName: data[key],
                        type: 'text'
                    }))];
                console.log('columns '+JSON.stringify(this.columns));
                this.haveFieldSet = true;
            })
            .catch((error) => {
                console.log('Error '+error);
                this.showError(error);
            });
    }
    showError(error) {
        const event = new ShowToastEvent({
            title: 'Error',
            message: error
        })
        this.dispatchEvent(event);
    }
}
