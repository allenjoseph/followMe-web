<script lang="ts">
  export let tenantId: string;
  export let routeId: string;

  function handleCopy(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
  ) {
    if (!document.execCommand) return;

    const input = event.currentTarget
      .previousElementSibling as HTMLInputElement;
    input.focus();
    input.select();
    document.execCommand("copy");
  }

  function load(node) {
    node.focus();
    node.select();
  }
</script>

{#if tenantId && routeId}
  <div class="share">
    <input
      use:load
      type="text"
      value={`${location.origin}/${tenantId}/${routeId}`}
      readonly
    />
    <button type="button" class="secondary" on:click={handleCopy}>
      Copiar
    </button>
  </div>
{/if}

<style>
  .share {
    display: flex;
    gap: 4px;
    margin-top: 16px;
  }
  .share > input {
    flex: 1;
  }
</style>
