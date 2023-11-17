import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Button } from 'primereact/button';
import ProductDetail from './ProductDetail';

export default function Dashboard() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [detailModal, setDetailModal] = useState(false);
    const [productDetail, setProductDetail] = useState({});

    useEffect(() => {
        getCategories()
        getProducts();
    }, [])

    // Request functions
    const getProducts = async () => {
        axios.get('/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(err => console.error(err));
    }

    const getCategories = async () => {
        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(err => console.error(err));
    }

    // Render functions
    const categoryRender = (rowData) => {
        let category = categories.find(category => category.Id === rowData.CategoryId)
        return (
            <span>{category.Name}</span>
        )
    }

    const transactionColumnRender = (rowData) => {
        return <Button size="small" icon="pi pi-pencil" severity="info" aria-label="Filter" onClick={()=>{setProductDetail(rowData);setDetailModal(true)}} />
    }

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Products</span>
            <Button severity='success' icon="pi pi-plus-circle" rounded raised />
        </div>
    );


    return (
        <>
            <div className='flex flex-row justify-content-center p-3'>
                <div className='flex flex-column'>
                    <DataTable value={products}  header={header} tableStyle={{ minHeight: "10vh", minWidth: '60rem' }}>
                        <Column field="Name" header="Name" ></Column>
                        <Column field="CategoryId" header="Category" body={categoryRender}></Column>
                        <Column field="Description" header="Description" style={{  }}></Column>
                        <Column field="" header="" body={transactionColumnRender}></Column>
                    </DataTable>
                </div>
            </div>


            <ProductDetail
                isOpen={detailModal}
                setIsOpen={setDetailModal}
                productDetail={productDetail}
            
            />
           

        </>
    )
}
