<template>
    <div class="content-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card p-4 shadow-lg">
                        <h2 class="text-center mb-4">Create New Account</h2>
                        <form @submit.prevent="submitForm()" id="signupForm">
                            <div class="mb-3">
                                <label for="signupName" class="form-label">Name</label>
                                <input type="text" class="form-control" v-model.trim="form.name" name="signupName" @blur="v$.name.$touch">
                                <span class="text-danger" v-if="v$.name.required.$invalid && v$.name.$dirty">Please write name.</span>
                                <span class="text-danger" v-if="v$.name.alphaSpaces.$invalid && v$.name.$dirty && !v$.name.required.$invalid">Please enter valid name.</span>
                            </div>
                            <div class="mb-3">
                                <label for="signupEmail" class="form-label">Email address</label>
                                <input type="email" class="form-control" v-model.trim="form.email" name="signupEmail" @blur="v$.email.$touch">
                                <span class="text-danger" v-if="v$.email.required.$invalid && v$.email.$dirty">Please write email.</span>
                                <span class="text-danger" v-if="v$.email.email.$invalid && v$.email.$dirty && !v$.email.required.$invalid">Please enter valid email.</span>
                            </div>
                            <div class="mb-3">
                                <label for="signupPassword" class="form-label">Password</label>
                                <input type="password" class="form-control" v-model.trim="form.password" name="signupPassword" @blur="v$.password.$touch">
                                <span class="text-danger" v-if="v$.password.required.$invalid && v$.password.$dirty">Please write password.</span>
                                <span class="text-danger" v-if="v$.password.minLength.$invalid && v$.password.$dirty && !v$.password.required.$invalid">Password must be at least {{ v$.password.minLength.$params.min }} characters long..</span>
                                <span v-if="v$.password.maxLength.$invalid && v$.password.$dirty && !v$.password.required.$invalid && !v$.password.minLength.$invalid" class="text-danger">
                                Password must not exceed {{ v$.password.maxLength.$params.max }} characters.
                                </span>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" v-model.trim="form.confirmPassword" name="confirmPassword" @blur="v$.confirmPassword.$touch">
                                <span class="text-danger" v-if="v$.confirmPassword.required.$invalid && v$.confirmPassword.$dirty">Please write confirm password.</span>
                                
                            </div>
                            <p v-if="apiErr" class="text-center text-danger">{{apiErr}}</p>
                            <button type="submit" class="btn btn-success w-100 mb-3">Sign Up</button>
                            <p class="text-center text-muted">Already have an account? <Router-link to="/login" class="text-decoration-none">Login here</Router-link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import useVuelidate from '@vuelidate/core'
    import { required, email, minLength, maxLength, sameAs, helpers } from '@vuelidate/validators'
    import { reactive, ref, computed } from 'vue';
    import { createUserWithEmailAndPassword } from 'firebase/auth';
    import { auth } from '@/utility/firebase';
import { useRouter } from 'vue-router';

    const form = reactive({name: "", email: "", password: "", confirmPassword: ""});
    const apiErr = ref("");
     // Custom validator for alphabets and spaces
    const alphaSpaces = helpers.withMessage(
        'Name can only contain alphabets and spaces',
        (value) => /^[a-zA-Z\s]*$/.test(value)
    );
    const router = useRouter();
    
    const rules = computed(() => {
        return {
            name: {
                required: helpers.withMessage('Please enter name.', required),
                alphaSpaces
            },
            email: {
                required: helpers.withMessage('Please enter email.', required),
                email: helpers.withMessage('Please enter a valid email address.', email)
            },
            password: {
                required: helpers.withMessage('Please enter password.', required),
                minLength: helpers.withMessage(({ $params }) => `Password must be at least ${$params.min} characters long.`, minLength(6)),
                maxLength: helpers.withMessage(({ $params }) => `Password must not exceed ${$params.max} characters.`, maxLength(20))
            },
            confirmPassword: {
                required: helpers.withMessage('Please enter confirm password.', required)
            }
        };
    });
   
    const v$ = useVuelidate(rules, form);
    const submitForm = async () => {
        v$.value.$touch();
        apiErr.value = "";
        if (form.password !== form.confirmPassword) {
            apiErr.value = "Password and Confirm Password doesn't match";
            return ;
        }
        const isFormValid = await v$.value.$validate();
        if (isFormValid) {
            createUserWithEmailAndPassword(auth, form.email, form.password).then((res) => {
                console.log("res ", res.user.accessToken);
                if (res.user.accessToken) {
                    router.push("/home");
                }
            }, (err) => {
                apiErr.value = err;
            })
        }


        
    };
</script>