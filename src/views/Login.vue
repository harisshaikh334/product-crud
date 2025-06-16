<template>
    <Loader v-if="isLoad" />
    <div class="content-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card p-4 shadow-lg">
                        <h2 class="text-center mb-4">Login to Your Account</h2>
                        <form @submit.prevent="submitForm">
                            <div class="mb-3 form-check">
                                <label for="loginEmail" class="form-label">Email address</label>
                                <input type="text" v-model.trim="form.email" class="form-control" name="loginEmail" @blur="v$.email.$touch">
                                <span class="text-danger" v-if="v$.email.email.$invalid && v$.email.$dirty && !v$.email.required.$invalid">Please enter valid email.</span>
                                <span class="text-danger" v-if="v$.email.required.$invalid && v$.email.$dirty">Please enter email.</span>
                            </div>
                            <div class="mb-3 form-check">
                                <label for="loginPassword" class="form-label">Password</label>
                                <input type="password" v-model.trim="form.password" class="form-control" name="loginPassword" @blur="v$.password.$touch">
                                <span class="text-danger" v-if="v$.password.required.$invalid && v$.password.$dirty">Please enter password.</span>
                                <span class="text-danger" v-if="v$.password.minLength.$invalid && v$.password.$dirty && !v$.password.required.$invalid">Password must be at least {{ v$.password.minLength.$params.min }} characters long.</span>
                                <span class="text-danger" v-if="v$.password.maxLength.$invalid && v$.password.$dirty && !v$.password.required.$invalid && !v$.password.minLength.$invalid">Password must not exceed {{ v$.password.maxLength.$params.max }} characters.</span>
                            </div>
                            <p v-if="apiErr" class="text-center text-danger">{{apiErr}}</p>
                            <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
                            <p class="text-center text-muted">Don't have an account? <RouterLink to="/register" class="text-decoration-none">Sign Up here</RouterLink></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import useVuelidate from '@vuelidate/core'
    import { required, email, minLength, maxLength } from '@vuelidate/validators'
    import { reactive, ref } from 'vue';
    import { auth } from '@/utility/firebase';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { useRouter } from 'vue-router';
    import Loader from '@/components/layouts/Loader.vue';
    import { useSwal } from '@/utility/useSwal';
    import { userAuthStore } from "@/stores/authStore";
    const authStore = userAuthStore();

    const { showSuccess, showError } = useSwal();
    let isLoad = ref(false);
    const router = useRouter();
    const form = reactive({email: "", password: ""});
    const apiErr = ref("");
    const rules = {
        email: { required, email },
        password: {required, minLength: minLength(6), maxLength: maxLength(20)}
    };
    
    const v$ = useVuelidate(rules, form);
    const submitForm = async () => {
        v$.value.$touch();
        apiErr.value = "";
        const isFormValid = await v$.value.$validate()
        if (isFormValid)
            isLoad.value = true;
            signInWithEmailAndPassword(auth, form.email, form.password).then((res) => {
                console.log("res ", res.user);
                localStorage.setItem("user", JSON.stringify(res.user));
                router.push("/home");
                authStore.setUserLogin(true);
                showSuccess("Login successfull!");
                isLoad.value = false;
            }, (err) => {
                isLoad.value = false;
                apiErr.value = err;
            })
    };
    
</script>