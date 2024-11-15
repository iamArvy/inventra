<template>
    <section>
        <div>
            <slot name="main" />
        </div>
        <div id="summary">
            <slot name="summary" />
        </div>
    </section>
</template>

<style scoped>
section{
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    gap: 1rem;
}

#summary>*:not(:last-child){
    margin-bottom: 10px;
}
</style>