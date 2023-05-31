<script>
	
	let buttonProps = {
	class:[$$restProps.class]
	}
</script>
	<button on:click
            on:mouse
            on:focus
			on:mousedown
			on:mouseover
			on:mouseenter
			on:mouseleave
		{...buttonProps}>
			<slot/>
	</button>

<style>
	.sound{
		color:green;
	}
</style>