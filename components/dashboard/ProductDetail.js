import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function ProductDetail(props) {

  const { isOpen, setIsOpen, productDetail } = props;

  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [newDetail, setNewDetail] = useState({});


  useEffect(() => {
    if (isOpen) {
      console.log(productDetail)
      getCategories()
      getSettings()
    }
  }, [isOpen])


  const getCategories = async () => {
    axios.get('/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => console.error(err));
  }

  const getSettings = async () => {
    axios.get('/api/setting')
      .then(response => {

        let tempArr = []

        productDetail?.ProductSettings && productDetail?.ProductSettings.map(productSetting=>{
          let setting = response.data.find(s => s.Id === productSetting.SettingId);
          let settingObj = {
            Name: setting.Name,
            Value: productSetting.Value
          }
          console.log(settingObj)
          tempArr.push(settingObj)
        })
        console.log(tempArr)
        setSettings(tempArr)
      }).catch(err => console.error(err));
  }

  const footerContent = (
    <div>
      <Button size='small' label="Cancel" severity='danger' icon="pi pi-times" onClick={() => { }} className="p-button-text" />
      <Button size='small' label="Update" severity='success' icon="pi pi-check" onClick={() => { }} className="p-button-text" autoFocus />
    </div>
  );

  const headerContent = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">Settings</span>
        <Button severity='success' icon="pi pi-plus-circle" rounded raised />
    </div>
);
  return (
    <div>
      <Dialog header="Product Detail" visible={isOpen} style={{ width: '50vw' }} onHide={() => setIsOpen(false)} footer={footerContent}>
        <div class="formgrid grid" style={{ justifyContent: "space-around" }}>

          <div class="field col-5">
            <div className="flex flex-column gap-2">
              <label htmlFor="username">Name</label>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText placeholder="Search" className='p-inputtext-sm w-full' />
              </span>
            </div>
          </div>

          <div class="field col-5">
            <div className="flex flex-column gap-2">
              <label htmlFor="username">Category</label>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <Dropdown value={selectedCategory} onChange={(e) => { setSelectedCategory(e.value) }} options={categories} optionLabel="Name"
                  placeholder="Select a City" className="w-full md:w-14rem" />
              </span>
            </div>
          </div>

          <div class="field col-5">
            <div className="flex flex-column gap-2">
              <label htmlFor="username">Detail</label>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText placeholder="Search" className='p-inputtext-sm w-full' />
              </span>
            </div>
          </div>

          <div class="field col-10">
            <DataTable value={settings} header={headerContent} >
              <Column field="Name" header="Name" ></Column>
              <Column field="Value" header="Value" ></Column>
            </DataTable>
          </div>



        </div>
      </Dialog>
    </div>
  )
}
