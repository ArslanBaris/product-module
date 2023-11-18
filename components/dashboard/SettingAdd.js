import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';


export default function SettingAdd(props) {

    const toast = useRef(null);
    const { isOpen, setIsOpen, addSetting } = props;

    const [selectedSetting, setSelectedSetting] = useState();
    const [settingValue, setSettingValue] = useState();    
    const [settingOptions, setSettingOptions] = useState([]);

    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }

    useEffect(() => {
        if (isOpen) {
            getSettings()
        }
    }, [isOpen])


    const getSettings = async () => {
        axios.get('/api/setting')
            .then(response => {
                setSettingOptions(response.data);
            }).catch(err => console.error(err));
    }

    const settingModalToggle = () => {
        setIsOpen(!isOpen)
        setSelectedSetting()
        setSettingValue()
    }

    const validate = () => {
        if (!selectedSetting) {
            showError('Please select a setting');
            return false;
        }
        if (!settingValue) {
            showError('Please enter a setting value');
            return false;
        }
        return true;
    }

    const onSubmit = () => {
        if (!validate()) {
            return;
        }
        let newSetting = {
           ...selectedSetting,
            
            Value: settingValue
        }
        addSetting(newSetting)
        settingModalToggle()

    }


    const settingFooterContent = (
        <div>
            <Button size='small' label="Cancel" severity='danger' icon="pi pi-times" onClick={() => { settingModalToggle() }} className="p-button-text" />
            <Button size='small' label="Add" severity='success' icon="pi pi-plus-circle" onClick={() => { onSubmit() }} className="p-button-text" autoFocus />
        </div>
    );

    return (
        <div>
            <Dialog header="Add Setting" visible={isOpen} style={{ width: '40vw' }} onHide={() => settingModalToggle()} footer={settingFooterContent}>
                <div class="formgrid grid" style={{ justifyContent: "space-around" }}>

                    <div class="field col-5">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Select Setting</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <Dropdown
                                    value={selectedSetting}
                                    onChange={(e) => { setSelectedSetting(e.value); }}
                                    options={settingOptions}
                                    optionLabel="Name"
                                    placeholder="Select a Setting" className="w-full" />
                            </span>
                        </div>
                    </div>

                    <div class="field col-5">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Setting Value</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText placeholder="Setting Value" className='p-inputtext-sm w-full' value={settingValue} onChange={(e) => { setSettingValue(e.target.value) }} />
                            </span>
                        </div>
                    </div>

                </div>
            </Dialog>

            <Toast ref={toast} />
        </div>
    )
}
