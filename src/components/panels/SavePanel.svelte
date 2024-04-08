<div class="title">
	<h1>PatchCanvas</h1>
	<button>Rename</button>
</div>

<div class="buttons">
<button>Load</button>
<button>Save</button>
</div>

<style>
	.title {
		position: relative;
		& h1 {
			margin: 0;
		}
		& button {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			opacity: 0;

			transition: opacity 0.2s ease-in-out;

			&:hover {
				opacity: 1;
			}
		}
	}
	.buttons {
		display: flex;
		gap: 0.5em;
		margin-top: 0.25em;

		& button {
			flex-grow: 1;
			padding-block: 0.5em;
		}
	}
</style>
