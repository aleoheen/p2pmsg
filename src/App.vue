<template lang="pug">
	
	#app
		#messages(ref="messagesList")
			div(v-for="{type, text} in messages", :class="`${type}`")
				span {{type | fcup}}:
				span {{text}}

		#buttom-input
			input(type="text", :disabled="!canWrite", :placeholder="`${prompt ? prompt : 'Waiting'}...`", @keydown.13.prevent="submit", v-model="field")

</template>

<style lang="less">
	@import "./assets/less/main";
</style>

<script src="./assets/js/app.js"></script>