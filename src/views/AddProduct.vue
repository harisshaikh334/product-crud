<template>
    <Loader v-if="isLoad" />
    <div class="content-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-7">
                    <div class="card p-4 shadow-lg">
                        <h1 class="text-center mb-4">{{ productId ? "Update Product" : "Add New Product" }}</h1>
                        <form @submit.prevent="submitForm" id="addProductForm">
                            <div class="mb-3">
                                <label for="productName" class="form-label">Product Name</label>
                                <input v-model.trim="formData.productName" type="text" class="form-control"
                                    id="productName" name="productName" @blur="v$.productName.$touch">
                                <span v-if="v$.productName.required.$invalid && v$.productName.$dirty"
                                    class="text-danger" maxlength="50">
                                    Product Name is required.
                                </span>
                                <span class="text-danger"
                                    v-if="v$.productName.alphaSpaces.$invalid && v$.productName.$dirty && !v$.productName.required.$invalid">Please
                                    enter valid name.</span>
                            </div>
                            <div class="mb-3">
                                <label for="productDescription" class="form-label">Description</label>
                                <textarea v-model.trim="formData.productDescription" class="form-control"
                                    id="productDescription" name="productDescription" rows="4" maxlength="200"
                                    @blur="v$.productDescription.$touch"></textarea>
                                <span v-if="v$.productDescription.required.$invalid && v$.productDescription.$dirty"
                                    class="text-danger">
                                    Description is required.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productPrice" class="form-label">Product Price</label>
                                <input v-model.number="formData.productPrice" type="text" class="form-control"
                                    id="productPrice" name="productPrice" @blur="v$.productPrice.$touch">
                                <span v-if="v$.productPrice.required.$invalid && v$.productPrice.$dirty"
                                    class="text-danger">
                                    Price is required.
                                </span>
                                <span v-if="v$.productPrice.numeric.$invalid && v$.productPrice.$dirty && !v$.productPrice.required.$invalid" class="text-danger">
                                    Product Price must be a number.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productCategory" class="form-label">Category</label>
                                <select v-model="formData.productCategory" class="form-select" id="productCategory"
                                    name="productCategory" @blur="v$.productCategory.$touch">
                                    <option selected disabled value="">Select a category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="jewelery">Jewelery</option>
                                    <option value="men's clothing">Men's clothing</option>
                                    <option value="women's clothing">Women's clothing</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home-decor">Home Decor</option>
                                    <option value="books">Books</option>
                                    <option value="sports">Sports</option>
                                </select>
                                <span v-if="v$.productCategory.required.$invalid && v$.productCategory.$dirty"
                                    class="text-danger">
                                    Category is required.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productImage" class="form-label">Product Image</label>
                                <input @change="uploadToCloudinary" accept="image/jpeg, image/jpg, image/png"
                                    type="file" class="form-control" id="productImage" name="productImage">
                                <div v-if="prodImage" class="mt-3 text-center">
                                    <img :src="prodImage" alt="Product Image Preview" class="img-thumbnail"
                                        style="max-width: 200px; max-height: 200px; object-fit: contain;">
                                </div>
                                <span
                                    v-if="v$.productImage.isValidFileType.$invalid && v$.productImage.$dirty && !v$.productImage.required.$invalid"
                                    class="text-danger">
                                    Invalid file type. Please select a JPG, JPEG, or PNG image.
                                </span>
                                <span
                                    v-if="v$.productImage.isWithinSizeLimit.$invalid && v$.productImage.$dirty && !v$.productImage.required.$invalid && !v$.productImage.isValidFileType.$invalid"
                                    class="text-danger">
                                    Image size exceeds the maximum limit of 10MB.
                                </span>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">{{ productId ? "Update Product" : "AddProduct"}}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import Loader from "@/components/layouts/Loader.vue";
import { required, helpers, numeric } from '@vuelidate/validators';
import { useRoute, useRouter } from 'vue-router';
import productService from '@/services/productService';
import { useSwal } from '@/utility/useSwal';

const { showSuccess, showError } = useSwal();
// Reactive form data
const formData = reactive({
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: null
});

let isLoad = ref(false);

const alphaSpaces = helpers.withMessage(
    'Name can only contain alphabets and spaces',
    (value) => /^[a-zA-Z\s]*$/.test(value)
);

const uploadToCloudinary = async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Read the file for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            prodImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        prodImage.value = null; // Clear preview if no file selected
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Free Public Upload");

    productService.uploadImage(formData).then(() => {
        uploadImgae.value = data.secure_url;
    })
}


let apiErr = ref("");

const router = useRouter();
const route = useRoute();
let prodImage = ref(null);
let uploadImgae = ref(null);
let productId = route.params.id;
onMounted(() => {
    if (productId)
        getProductDetails();
})

const getProductDetails = () => {
    isLoad.value = true;
    productService.getProduct(productId).then((data) => {
        isLoad.value = false;
        if (data) {
            formData.productName = data.title;
            formData.productDescription = data.description;
            formData.productCategory = data.category;
            formData.productPrice = data.price;
            prodImage.value = data.image;
        }
    }, () => {
        isLoad.value = false;
        showError("product not found.");
        productId = null;
        router.push("/add-product");
    })

}
// Custom validator for file type
const isValidFileType = helpers.withMessage(
    'Invalid file type.',
    (value) => {
        if (!value) return true; // Let 'required' validator handle empty
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        return allowedTypes.includes(value.type);
    }
);
// Custom validator for file size (10 MB limit)
const isWithinSizeLimit = helpers.withMessage(
    'File size exceeds 10MB.',
    (value) => {
        if (!value) return true; // Let 'required' validator handle empty
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
        return value.size <= maxSize;
    }
);
const rules = computed(() => {
    return {
        productName: {
            required: helpers.withMessage('Product Name is required.', required),
            alphaSpaces
        },
        productDescription: {
            required: helpers.withMessage('Description is required.', required)
        },
        productPrice: { 
            required: helpers.withMessage('Price is required.', required),
            numeric: helpers.withMessage('Product Price must be a number.', numeric),
         },
        productCategory: { required: helpers.withMessage('Category is required.', required) },
        productImage: {
            isValidFileType,
            isWithinSizeLimit
        }
    };
});

const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
    v$.value.$touch();
    const isFormValid = await v$.value.$validate();

    apiErr.value = "";
    if (!isFormValid) {
        return;
    }
    //productId for edit
    const product = {
        title: formData.productName,
        price: formData.price,
        description: formData.description,
        image: uploadImgae || null,
        category: formData.category
    };
    isLoad.value = true;
    if (productId) {
        product["id"] = productId;

        productService.editProducts(product, productId).then(() => {
            showSuccess("Product updated successfully.");
            router.push("/home");
            isLoad.value = false;
        }, (err) => {
            isLoad.value = false;
            showError("Something went wrong. Please try again.");
        })

    } else {

        productService.addProducts(product).then(() => {
            showSuccess("Product Added successfully.");
            router.push("/home");
            isLoad.value = false;
        }, (err) => {
            isLoad.value = false;
            apiErr.value = data.message;
            showError("Something went wrong. Please try again later");
        })
    }



}
</script>