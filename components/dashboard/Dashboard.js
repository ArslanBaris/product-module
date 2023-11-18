import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Button } from 'primereact/button';
import ProductDetail from './ProductDetail';
import ProductAdd from './ProductAdd';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';

export default function Dashboard() {

    const toast = useRef(null);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState([]);

    const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [productDetail, setProductDetail] = useState({});
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        Description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        CategoryId: { value: null, matchMode: FilterMatchMode.IN },
    });

    // Notifactaions
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Oops', detail: message, life: 3000 });
    }

    useEffect(() => {
        getSettings();
        getCategories()
        getProducts();
    }, [trigger])

    const allowExpansion = (rowData) => {
        return rowData.ProductSettings.length > 0;
    };

    // Request functions
    const getProducts = async () => {
        setLoading(true);
        await axios.get('/api/products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                showError('Error while fetching products')
                console.error(err)
            });
    }

    const getCategories = async () => {
        await axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(err => {
                showError('Error while fetching categories')
                console.error(err)
            });
    }

    const getSettings = async () => {
        await axios.get('/api/setting')
            .then(response => {
                setSettings(response.data)
            })
            .catch(err => {
                showError('Error while fetching settings')
                console.error(err)
            });
    }

    // Render functions
    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Products</span>
            <Button severity='success' icon="pi pi-plus-circle" rounded raised onClick={() => { setAddModalIsOpen(true) }} />
        </div>
    );

    const categoryRender = (rowData) => {
        let category = categories.find(category => category.Id === rowData.CategoryId)
        return (
            <span>{category?.Name}</span>
        )
    }

    const transactionColumnRender = (rowData) => {
        return <Button size="small" icon="pi pi-pencil" severity="info" aria-label="Filter" onClick={() => { setProductDetail(rowData); setDetailModalIsOpen(true) }} />
    }

    const categoryRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={categories}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="Name"
                optionValue="Id"
                placeholder="Any"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '14rem' }}
            />
        );
    };

    const settingRender = (rowData) => {
        if (!settings.length)
            return <span></span>
        console.log(settings)
        let setting = settings.find(setting => setting.Id === rowData.SettingId)
        return (
            <span>{setting?.Name}</span>
        )
    }

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <DataTable value={data?.ProductSettings}>
                    <Column field="SettingId" header="Name" sortable body={settingRender}></Column>
                    <Column field="Value" header="Value" sortable></Column>
                </DataTable>
            </div>
        );
    };

    return (
        <>
            <div className='flex flex-row justify-content-center p-3'>
                <div className='flex flex-column'>
                    <DataTable
                        value={products}
                        header={header}
                        dataKey="Id"
                        paginator
                        filters={filters}
                        rows={5}
                        loading={loading}
                        filterDisplay="row"
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{ minHeight: "10vh", minWidth: '70rem' }}>
                        <Column expander={allowExpansion} style={{ width: '5rem' }} />
                        <Column field="Name" header="Name" filter filterPlaceholder="Search by Name" showFilterMenu={false} sortable></Column>
                        <Column field="CategoryId" header="Category" filter filterElement={categoryRowFilterTemplate} body={categoryRender} showFilterMenu={false} sortable></Column>
                        <Column field="Description" header="Description" showFilterMenu={false} filter filterPlaceholder="Search by Description" sortable></Column>
                        <Column field="" header="" body={transactionColumnRender}></Column>
                    </DataTable>
                </div>
            </div>

            <ProductAdd
                isOpen={addModalIsOpen}
                setIsOpen={setAddModalIsOpen}
                categories={categories}
                trigger={trigger}
                setTrigger={setTrigger}
            />

            <ProductDetail
                isOpen={detailModalIsOpen}
                setIsOpen={setDetailModalIsOpen}
                productDetail={productDetail}
                categories={categories}
                trigger={trigger}
                setTrigger={setTrigger}
            />

            <Toast ref={toast} />

        </>
    )
}
