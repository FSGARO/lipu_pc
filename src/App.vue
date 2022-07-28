<!--
 * @Description: 
 * @Author: 
 * El Psy Congroo
-->
<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: left;
	color: #2c3e50;
}

/*在Chrome下移除input[number]的上下箭头*/
.no-number {
	::-webkit-outer-spin-button,
	::-webkit-inner-spin-button {
		margin: 0;
		-webkit-appearance: none !important;
	}
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		margin: 0;
		-webkit-appearance: none !important;
	}
	/*在firefox下移除input[number]的上下箭头*/
	-moz-appearance: textfield;
	input[type='number'] {
		-moz-appearance: textfield;
	}
}
</style>
