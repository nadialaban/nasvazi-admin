<template>
    <div class="form-group form-group-sm row" :class="{'required': required}">
        <div class="col-md-4 align-self-center" style="text-align: left">
            <span class="text-muted">{{ title }}</span>
        </div>
        <div class="col-md-8">
            <slot></slot>
            <span class="error">{{ error }}</span>
        </div>

    </div>
</template>

<script>
export default {
    name: "FormGroup-4-8",
    props: ['title', 'required', 'error']
}
</script>

<style scoped>
.form-group.required strong:after {
    color: #ba1a1a;
    content: ' *';
    font-size: 18px;
}
</style>
