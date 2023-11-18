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
import SettingAdd from './SettingAdd';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export default function ProductDetail(props) {

  const toast = useRef(null);
  const { isOpen, setIsOpen, productDetail, categories, trigger, setTrigger } = props;

  const [settings, setSettings] = useState([]);
  const [settingOptions, setSettingOptions] = useState([]);
  const [newDetail, setNewDetail] = useState({});
  const [addSettingModal, setAddSettingModal] = useState(false);

  // Notifactaions
  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Oops !', detail: message, life: 3000 });
  }

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
  }

  useEffect(() => {
    if (isOpen) {
      setNewDetail({ ...productDetail }) // clone object
      getSettings()
    }
  }, [isOpen])

  // Request functions

  const getSettings = async () => {
    axios.get('/api/setting')
      .then(response => {
        setSettingOptions(response.data);
        let tempArr = []

        // create new array with setting name and value
        productDetail?.ProductSettings && productDetail?.ProductSettings.map(productSetting => {
          let setting = response.data.find(s => s.Id === productSetting.SettingId);
          let settingObj = {
            Setting: { Id: productSetting.SettingId, Name: setting.Name },
            Value: productSetting.Value
          }
          tempArr.push(settingObj)
        })
        setSettings(tempArr)
        console.log(tempArr)

      }).catch(err => console.error(err));
  }

  const onSubmitUpdate = async () => {
    if (validateForm()) {

      let newSettings = settings.map(setting => {
        return {
          SettingId: setting.Setting.Id,
          Value: setting.Value
        }
      })

      let newDetailObj = {
        ...newDetail,
        ProductSettings: newSettings
      }

      await axios.put('/api/products?id=' + newDetail.Id, newDetailObj)
        .then(response => {
          showSuccess("Product updated successfully !")
          setTrigger(!trigger)
          modalToggle()
        }).catch(err => console.error(err));
    };


  }

  const deleteProduct = async () => {
    await axios.delete('/api/products?id=' + newDetail.Id)
      .then(response => {
        showSuccess("Product deleted successfully !")
        setTrigger(!trigger)
        modalToggle()
      }).catch(err => {
        showError("Something went wrong !")
        console.error(err)
      });

  };

  // Event functions
  const addSettingFunc = (setting) => {
    console.log(setting)
    let newSettings = {
      Setting: { Id: setting.Id, Name: setting.Name },
      Value: setting.Value
    };
    setSettings([...settings, newSettings])
  }

  const modalToggle = () => {
    setNewDetail({})
    setSettings([])
    setSettingOptions([])
    setIsOpen(!isOpen)
  }

  const onRowEditComplete = (e) => {

    let { newData, index } = e;

    let _settings = [...settings];
    _settings[index] = newData;

    setSettings(_settings);
  };

  const setDetailFunc = (key, value) => {
    setNewDetail({ ...newDetail, [key]: value })
  }

  const removeSetting = (rowData) => {
    let newSettings = settings.filter(setting => setting.Setting.Id !== rowData.Setting.Id)
    setSettings(newSettings)
  }

  // Validation function
  const validateForm = () => {
    if (newDetail?.Name == null || newDetail?.Name == '' || newDetail?.Name == undefined || newDetail?.Name.trim() == '') {
      showError("Please enter a product name !")
      return false;
    }
    if (newDetail.CategoryId == null || newDetail.CategoryId == '' || newDetail.CategoryId == undefined) {
      showError("Please select a category !")
      return false;
    }
    if (newDetail?.Description == null || newDetail?.Description == '' || newDetail?.Description == undefined || newDetail?.Description.trim() == '') {
      showError("Please enter a product description !")
      return false;
    }
    if (settings.length == 0) {
      showError("Please add at least one setting !")
      return false;
    }
    if (settings.some(setting => !validateSettingObject(setting))) {
      return false;
    }
    return true
  }

  const validateSettingObject = (setting) => {
    if (setting.Setting == null || setting.Setting == undefined) {
      showError("Please select a setting !")
      return false;
    }
    if (setting.Value == null || setting.Value == '' || setting.Value == undefined || setting.Value.trim() == '') {
      showError("Please enter a value !")
      return false;
    }
    return true;
  }

  // Render functions
  const confirm = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Are you sure you want to delete this product?',
      icon: 'pi pi-exclamation-triangle',
      accept: deleteProduct,
    });
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const settingEditor = (options) => {

    return (
      <Dropdown
        value={options.value}
        options={settingOptions}
        onChange={(e) => { options.editorCallback(e.value) }}
        optionLabel="Name"
        placeholder="Select a Status"
      />
    );
  };

  const settingRender = (rowData) => {
    return <span>{rowData?.Setting?.Name}</span>
  }

  const deleteSetting = (rowData) => {
    return (<div>
      <Button size="small" icon="pi pi-trash" severity="danger" aria-label="Filter" onClick={() => { removeSetting(rowData) }} />
    </div>)
  }

  const footerContent = (
    <div className='mt-3' style={{ display: "flex", justifyContent: "space-between" }}>
      <div >
        <Button size='small' label="Cancel" severity='danger' icon="pi pi-times" onClick={() => { modalToggle() }} className="p-button-text" />
      </div>
      <div>
        <Button size='small' label="Delete" severity='danger' icon="pi pi-trash" onClick={confirm} className="p-button-text" autoFocus />
        <Button size='small' label="Update" severity='success' icon="pi pi-check" onClick={() => { onSubmitUpdate() }} className="p-button-text" autoFocus />
      </div>
    </div>
  );

  const headerContent = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Settings</span>
      <Button severity='success' icon="pi pi-plus-circle" rounded raised onClick={() => { setAddSettingModal(true) }} />
    </div>
  );

  return (
    <div>
      <Dialog header="Product Detail" visible={isOpen} style={{ width: '50vw' }} onHide={() => modalToggle()} footer={footerContent}>
        <div class="formgrid grid" style={{ justifyContent: "space-around" }}>

          <div class="field col-5">
            <div className="flex flex-column gap-2">
              <label htmlFor="username">Name</label>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText placeholder="Product Name" className='p-inputtext-sm w-full' value={newDetail?.Name} onChange={(e) => { setDetailFunc("Name", e.target.value) }} />
              </span>
            </div>
          </div>

          <div class="field col-5">
            <div className="flex flex-column gap-2">
              <label htmlFor="username">Category</label>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <Dropdown
                  value={newDetail?.CategoryId}
                  onChange={(e) => { setDetailFunc("CategoryId", e.value); }}
                  options={categories}
                  optionLabel="Name"
                  optionValue='Id'
                  placeholder="Select a City"
                  className="w-full" />
              </span>
            </div>
          </div>

          <div class="field col-11">
            <div className="flex flex-column gap-2">
              <label htmlFor="username">Description</label>
              <span className="p-input-icon-left">
                <i className="pi pi-info-circle" />
                <InputTextarea
                  placeholder="Description"
                  rows={3}
                  value={newDetail?.Description}
                  className='p-inputtext-sm w-full'
                  onChange={(e) => { setDetailFunc("Description", e.target.value) }}
                />
              </span>
            </div>
          </div>

          <div class="field col-11">
            <DataTable value={settings} header={headerContent} editMode="row" onRowEditComplete={onRowEditComplete} >
              <Column field="Setting" header="Name" editor={(options) => settingEditor(options)} body={settingRender} ></Column>
              <Column field="Value" header="Value" editor={(options) => textEditor(options)} ></Column>
              <Column rowEditor bodyStyle={{ textAlign: 'center', width: '25%' }}></Column>
              <Column field="" header="" body={deleteSetting} bodyStyle={{ width: '5%' }} ></Column>
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
      <ConfirmPopup />
    </div>
  )
}
