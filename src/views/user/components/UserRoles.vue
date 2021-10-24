<template>
    <div>
        {{ user.id }}
    </div>
</template>

<script>
export default {
    name: 'User Roles',
    props: {
        user: Object,
    },
    data: () => ({

    })
}
</script>