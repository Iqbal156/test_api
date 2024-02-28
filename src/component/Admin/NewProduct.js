

import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../Layout/MetaData';
import Sidebar from './Sidebar';
import { AccountTree, AttachMoney, Description, Phone, Spellcheck, Storage } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, createProduct } from '../../action/productAction';
import { NEW_PRODUCT_RESET } from '../../constant/productConstant';
import "./NewProduct.css";


const NewProduct = () => {

    const dispatch = useDispatch();

    const { error, loading, success } = useSelector((state) => state.newProduct);
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    console.log(success);
    // set category 
    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ];

    useEffect(() => {
        if (error) {
            toast.error(error)
            console.log(error)
            dispatch(clearErrors());

        }
        if (success) {
            toast.success("Product create successfully")
            navigate("/admin/dashboard")
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [dispatch, error, success, navigate])

    const createProductSubmitHandler = async (e) => {
        e.preventDefault();

        // const productData = {
        //     productName: name,
        //     description: description,
        //     price: price,
        //     category: category,
        //     quantity: Stock,
        //     phoneNumber: phoneNumber,
        //     location: location,
        //     images: images.map((image) => {
        //         return {
        //             images: image
        //         };
        //     })
        // };
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("productName", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("quantity", Stock);
        myForm.set("phoneNumber", phoneNumber);
        myForm.set("location", location);
        images.forEach((image) => {
            myForm.append("images", image); // Use append instead of set
        });
        console.log(myForm);
        dispatch(createProduct(myForm));
    }


    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    }


    return (
        <Fragment>
            <MetaData title="Create Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        encType="multipart/form-data"
                        onSubmit={createProductSubmitHandler}
                    >
                        <h1>Create Product</h1>

                        <div>
                            <Spellcheck />
                            <input
                                type="text"
                                placeholder="Product Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <AttachMoney />
                            <input
                                type="number"
                                placeholder="Price"
                                required
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div>
                            <Description />

                            <textarea
                                placeholder="Product Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                cols="30"
                                rows="1"
                            ></textarea>
                        </div>

                        <div>
                            <AccountTree />
                            <select onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map((cate) => (
                                    <option key={cate} value={cate}>
                                        {cate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Storage />
                            <input
                                type="number"
                                placeholder="Stock"
                                required
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div>
                            <Phone />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                required
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <Storage />
                            <input
                                type="text"
                                placeholder="Location"
                                required
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div id="createProductFormFile">
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={createProductImagesChange}
                                multiple
                            />
                        </div>

                        <div id="createProductFormImage">
                            {imagesPreview.map((image, index) => (
                                <img key={index} src={image} alt="Product Preview" />
                            ))}
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false}
                        >
                            Create
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default NewProduct;