<script lang="ts" setup>
	import {} from "vue";
</script>

<template>
	<div class="test">
		<slot/>
	</div>
	<Teleport to="body">
		div.hello
	</Teleport>
</template>
