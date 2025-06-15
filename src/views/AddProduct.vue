<template>
    <div class="content-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-7">
                    <div class="card p-4 shadow-lg">
                        <h1 class="text-center mb-4">{{ productId ? "Update Product" : "Add New Product"}}</h1>
                        <form @submit.prevent="submitForm" id="addProductForm">
                            <div class="mb-3">
                                <label for="productName" class="form-label">Product Name</label>
                                <input v-model.trim="formData.productName" type="text" class="form-control" id="productName" name="productName">
                                <span v-if="v$.productName.required.$invalid && v$.productName.$dirty" class="invalid-feedback" maxlength="50">
                                Product Name is required.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productDescription" class="form-label">Description</label>
                                <textarea v-model.trim="formData.productDescription" class="form-control" id="productDescription" name="productDescription" rows="4" maxlength="200"></textarea>
                                <span v-if="v$.productDescription.required.$invalid && v$.productDescription.$dirty" class="invalid-feedback">
                                    Description is required.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productPrice" class="form-label">Product Price</label>
                                <input v-model.number="formData.productPrice" type="text" class="form-control" id="productPrice" name="productPrice">
                                <span v-if="v$.productPrice.required.$invalid && v$.productPrice.$dirty" class="invalid-feedback">
                                    Category is required.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productCategory" class="form-label">Category</label>
                                <select v-model="formData.productCategory" class="form-select" id="productCategory" name="productCategory">
                                    <option selected disabled value="">Select a category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home-decor">Home Decor</option>
                                    <option value="books">Books</option>
                                    <option value="sports">Sports</option>
                                </select>
                                <span v-if="v$.productCategory.required.$invalid && v$.productCategory.$dirty" class="invalid-feedback">
                                    Category is required.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="productImage" class="form-label">Product Image</label>
                                <input @change="uploadToCloudinary" accept="image/jpeg, image/jpg, image/png" type="file" class="form-control" id="productImage" name="productImage">
                                <div v-if="prodImage" class="mt-3 text-center">
                                    <img :src="prodImage" alt="Product Image Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px; object-fit: contain;">
                                </div>
                                <span v-if="v$.productImage.isValidFileType.$invalid && v$.productImage.$dirty && !v$.productImage.required.$invalid" class="invalid-feedback">
                                    Invalid file type. Please select a JPG, JPEG, or PNG image.
                                </span>
                                <span v-if="v$.productImage.isWithinSizeLimit.$invalid && v$.productImage.$dirty && !v$.productImage.required.$invalid && !v$.productImage.isValidFileType.$invalid" class="invalid-feedback">
                                    Image size exceeds the maximum limit of 10MB.
                                </span>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Add Product</button>
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
import { required, helpers,minLength , maxLength } from '@vuelidate/validators';
import { useRoute, useRouter } from 'vue-router';
    // Reactive form data
    const formData = reactive({
        productName: '',
        productDescription: '',
        productCategory: '',
        productPrice: null
    });

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
        let url = "https://api.cloudinary.com/v1_1/dpbwuqj8m/image/upload";
        fetch(url, {method: "POST", body: formData}).then(response => response.json())
        .then(data => {
            
            uploadImgae.value = data.secure_url;
            console.log("data is ", data, uploadImgae);
        });
    }


    let apiErr = ref("");
    
    const router = useRouter();
    const route = useRoute();
    let prodImage = ref(null);
    let uploadImgae = ref(null);
    const productId = route.params.id;
    console.log("product is ", productId);
    onMounted(() => {
        console.log(productId);
        if (productId)
            getProductDetails();
    })

    const getProductDetails = () => {
        fetch('https://fakestoreapi.com/products/'+productId)
            .then(response => response.json())
            .then(data => {
                console.log("data ", data);
                formData.productName = data.title;
                formData.productDescription = data.description;
                formData.productCategory = data.category;
                formData.productPrice = data.price;
                prodImage.value = data.image;
            });

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
                required: helpers.withMessage('Product Name is required.', required)
            },
            productDescription: { 
                required: helpers.withMessage('Description is required.', required)
            },
            productPrice: { required: helpers.withMessage('Price is required.', required) },
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
         console.log("is form valid ", v$.value);
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
        if (productId) {
            product["id"] = productId;
            
            fetch('https://fakestoreapi.com/products/'+productId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            })
                .then(response => response.json())
                .then(data => {
                    router.push("/home");
                });

         } else {
            fetch('https://fakestoreapi.com/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            }).then(response => response.json())
                .then(data =>{ 
                    console.log("prod success ",data);
                    router.push("/home");
                }, (err) => {
                    apiErr.value = data.message;
            });
         }
        
        

    }
</script>