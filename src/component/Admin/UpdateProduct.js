import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getProductDetails, updateProduct } from '../../action/productAction';
import { toast } from 'react-toastify';
import { UPDATE_PRODUCT_RESET } from '../../constant/productConstant';
import MetaData from '../Layout/MetaData';
import Sidebar from './Sidebar';
import { AccountTree, AttachMoney, Description, LocationOn, Phone, Spellcheck, Storage } from '@mui/icons-material';
import { Button } from '@mui/material';


const UpdateProduct = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { error, product } = useSelector((state) => state.productDetails);
    const { loading, error: updateError, isUpdate } = useSelector((state) => state.product);
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const productId = id;

    useEffect(() => {

        if (product && product?._id !== productId) {
            dispatch(getProductDetails(productId))
        } else {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.Stock);
            setOldImages(product.images);
            setLocation(product.location);
            setPhoneNumber(product.phoneNumber);
        }
        if (error) {
            toast.error(error)
            dispatch(clearErrors());
        }
        if (updateError) {
            toast.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdate) {
            toast.success("Update product successful");
            navigate("/admin/dashboard")
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }

    }, [product, error, updateError, dispatch, isUpdate, navigate, productId])
    // update product handler 
    const updateProductHandlerSubmit = (e) => {
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
        dispatch(updateProduct(productId, myForm));
    }

    console.log(name);

    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

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
    };

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ];

    return (
        <Fragment>
            <MetaData title="Create Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        encType="multipart/form-data"
                        onSubmit={updateProductHandlerSubmit}
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
                                value={price}
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
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
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
                                value={Stock}
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
                            <LocationOn />
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
                                onChange={updateProductImagesChange}
                                multiple
                            />
                        </div>

                        <div id="createProductFormImage">
                            {oldImages &&
                                oldImages.map((image, index) => (
                                    <img key={index} src={image.url} alt="Old Product Preview" />
                                ))}
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

export default UpdateProduct;