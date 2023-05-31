<script>
	let buttonProps = {
	class:[$$restProps.class]
	}
</script>

<button on:click
		on:mouse
		on:mousedown
		on:mouseup
	{...buttonProps}>
		<slot/>
</button>

<style>
	.sound{
		color:green;
	}
</style>