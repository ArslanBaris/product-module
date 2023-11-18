import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import SettingAdd from './SettingAdd';
import { generateUniqueKey } from '@/Utils/Utils';
import { Toast } from 'primereact/toast';


export default function ProductAdd(props) {

    const toast = useRef(null);
    const { isOpen, setIsOpen, categories, trigger, setTrigger } = props;

    const [addSettingModal, setAddSettingModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();
    const [productName, setProductName] = useState();
    const [productDetail, setProductDetail] = useState();
    const [addedSettings, setAddedSettings] = useState([]);

    // Notifactaions
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Oops', detail: message, life: 3000 });
    }

    const showSuccess = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    }

    const removeSetting = (rowData) => {
        let newSettings = addedSettings.filter(setting => setting.Id !== rowData.Id)
        setAddedSettings(newSettings)
    }

    const deleteSetting = (rowData) => {
        return (<div >
            <Button size="small" icon="pi pi-trash" severity="danger" aria-label="Filter" onClick={() => { removeSetting(rowData) }} />
        </div>)
    }

    // Event functions
    const modalToggle = () => {
        setIsOpen(!isOpen)
        setProductDetail(null)
        setProductName(null)
        setSelectedCategory(null)
        setAddedSettings([])
    }

    const addSettingFunc = (setting) => {
        setAddedSettings([...addedSettings, setting])
    }

    // Render functions
    const footerContent = (
        <div>
            <Button size='small' label="Cancel" severity='danger' icon="pi pi-times" onClick={() => { modalToggle() }} className="p-button-text" />
            <Button size='small' label="Add" severity='success' icon="pi pi-plus-circle" onClick={() => { onSubmit() }} className="p-button-text" autoFocus />
        </div>
    );

    const headerContent = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Settings</span>
            <Button severity='success' icon="pi pi-plus-circle" rounded raised onClick={() => { setAddSettingModal(true); }} />
        </div>
    );


    const onSubmit = async () => {
        if (validateForm()) {

            let newSettings = addedSettings.map(setting => {
                return {
                    SettingId: setting.Id,
                    Value: setting.Value
                }
            })

            let newProduct = {
                Id: generateUniqueKey(),
                Name: productName,
                Description: productDetail,
                CategoryId: selectedCategory.Id,
                ProductSettings: newSettings
            }
            await axios.post('/api/products', newProduct)
                .then(response => {
                    showSuccess("Product added successfully !")
                    setTrigger(!trigger)
                    modalToggle()

                }).catch(err => console.error(err));
        };
    }

    const validateForm = () => {
        if (productName == null || productName == '' || productName == undefined || productName.trim() == '') {
            showError("Please enter a product name !")
            return false;
        }
        if (selectedCategory == null || selectedCategory == '' || selectedCategory == undefined) {
            showError("Please select a category !")
            return false;
        }
        if (productDetail == null || productDetail == '' || productDetail == undefined || productDetail.trim() == '') {
            showError("Please enter a product description !")
            return false;
        }
        if (addedSettings.length == 0) {
            showError("Please add at least one setting !")
            return false;
        }
        return true
    }

    return (
        <div>
            <Dialog header="New Product" visible={isOpen} style={{ width: '50vw' }} onHide={() => modalToggle()} footer={footerContent}>
                <div class="formgrid grid" style={{ justifyContent: "space-around" }}>

                    <div class="field col-5">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Product Name</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText placeholder="Product Name" className='p-inputtext-sm w-full' value={productName} onChange={(e) => { setProductName(e.target.value) }} />
                            </span>
                        </div>
                    </div>

                    <div class="field col-5">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Category</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <Dropdown
                                    onChange={(e) => { setSelectedCategory(e.value); console.log(e.value) }}
                                    options={categories}
                                    value={selectedCategory}
                                    optionLabel="Name"
                                    placeholder="Select a Category" className="w-full" />
                            </span>
                        </div>
                    </div>

                    <div class="field col-11">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Product Detail</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-info-circle" />
                                <InputTextarea placeholder="Product Detail" rows={3} value={productDetail} className='p-inputtext-sm w-full' onChange={(e) => { setProductDetail(e.target.value) }} />
                            </span>
                        </div>
                    </div>

                    <div class="field col-11">
                        <DataTable value={addedSettings} header={headerContent} >
                            <Column field="Name" header="Name" ></Column>
                            <Column field="Value" header="Value" ></Column>
                            <Column field="" header="" body={deleteSetting} ></Column>
                        </DataTable>
                    </div>

                </div>
            </Dialog>

            <SettingAdd
                isOpen={addSettingModal}
                setIsOpen={setAddSettingModal}
                addSetting={addSettingFunc}
            />

            <Toast ref={toast} />
        </div>
    )
}
