<script lang="ts">
  import { onMount } from "svelte";
  import { Calculator } from "./classes/CalculatorState.js";
  import { UIManager } from "./classes/UIManager.js";
  import { CalculatorHandler } from "./classes/CalculatorHandler.js";

  let screenElement: HTMLElement;
  let calculatorHandler: CalculatorHandler;

  onMount(() => {
    console.log("Calculator mounting...");
    const calculator = new Calculator();
    const uiManager = new UIManager(screenElement, calculator);
    calculatorHandler = new CalculatorHandler(calculator, uiManager);

    uiManager.initializeScreen();
    const calcButtons = document.querySelector(".calc-buttons");
    if (!calcButtons) return;

    calcButtons.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.matches("button")) return;

      if (target.hasAttribute("data-number")) {
        calculatorHandler.handleButtonClick(target.textContent || "");
      } else if (target.hasAttribute("data-action")) {
        const actionMap: Record<string, string> = {
          clear: "AC",
          delete: "DEL",
          multiply: "×",
          divide: "÷",
          add: "+",
          subtract: "−",
          decimal: ",",
          equals: "=",
          sqrt: "√",
          square: "x²",
          left: "←",
          right: "→",
        };

        const action = target.getAttribute("data-action");
        if (action && action in actionMap) {
          calculatorHandler.handleButtonClick(actionMap[action] || "");
        }
      }
    });
  });
</script>

<main>
  <div class="wrapper glass">
    <section class="screen" bind:this={screenElement}>
      <div class="expression-line">
        <div class="current-expression">0<span class="cursor"></span></div>
        <div class="preview"></div>
      </div>
    </section>

    <section class="calc-buttons">
      <div class="move-buttons">
        <button class="move-button" data-action="left">&larr;</button>
        <button class="move-button" data-action="right">&rarr;</button>
      </div>

      <div class="calc-grid">
        <div class="calc-button-row">
          <button class="calc-button" data-number>7</button>
          <button class="calc-button" data-number>8</button>
          <button class="calc-button" data-number>9</button>
          <button class="calc-button operator" data-action="delete">DEL</button>
          <button class="calc-button double operator" data-action="clear"
            >AC</button
          >
        </div>
        <div class="calc-button-row">
          <button class="calc-button" data-number>4</button>
          <button class="calc-button" data-number>5</button>
          <button class="calc-button" data-number>6</button>
          <button class="calc-button operator" data-action="multiply"
            >&times;</button
          >
          <button class="calc-button operator" data-action="divide"
            >&divide;</button
          >
        </div>
        <div class="calc-button-row">
          <button class="calc-button" data-number>1</button>
          <button class="calc-button" data-number>2</button>
          <button class="calc-button" data-number>3</button>
          <button class="calc-button operator" data-action="add">&plus;</button>
          <button class="calc-button operator" data-action="subtract"
            >&minus;</button
          >
        </div>
        <div class="calc-button-row">
          <button class="calc-button" data-number>0</button>
          <button class="calc-button operator" data-action="decimal"
            >&comma;</button
          >
          <button class="calc-button operator" data-action="sqrt"
            >&radic;</button
          >
          <button class="calc-button operator" data-action="square">x²</button>
          <button class="calc-button double operator" data-action="equals"
            >&equals;</button
          >
        </div>
      </div>
    </section>
  </div>
</main>

<style lang="scss">
  // Variables
  $primary-color: #232323;
  $accent-color: #d72880;
  $accent-hover: #e93891;
  $button-bg: rgba(255, 255, 255, 0.75);
  $wrapper-bg: rgba(255, 255, 255, 0.3);
  $active-color: #ffef78;
  $gap-size: 15px;
  $blur-effect: blur(5.5px);
  $border-radius-lg: 16px;
  $border-radius-md: 12px;

  // Mixins
  @mixin glass-effect {
    backdrop-filter: $blur-effect;
    -webkit-backdrop-filter: $blur-effect;
  }

  @mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @mixin button-base {
    background: $button-bg;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: $border-radius-md;
    box-shadow: 0 4px 30px rgba(35, 35, 35, 0.1);
    color: $primary-color;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  // Global styles
  :global(body) {
    min-height: 100vh;
    @include flex-center;
    background: linear-gradient(320deg, #03a9f4, #e91e63, #3f51b5);
    margin: 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  // Component styles
  .wrapper {
    @include glass-effect;
    background: $wrapper-bg;
    border: 1px solid rgba(255, 255, 255, 0.34);
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 30px rgba(35, 35, 35, 0.1);
    color: $primary-color;
    width: 400px;
    height: 600px;
    padding: 25px;
  }

  .screen {
    background: $button-bg;
    border: 1px solid rgba(255, 255, 255, 0.01);
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 30px rgba(35, 35, 35, 0.1);
    color: $primary-color;
    font-size: 40px;
    height: 80px;
    margin-bottom: 25px;
    overflow: auto;
    padding: 10px 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .expression {
      font-size: 24px;
      color: rgba($primary-color, 0.7);
      margin-bottom: 5px;
      min-height: 24px;
      width: 100%;
      text-align: right;
    }

    .current-value {
      font-size: 40px;
      width: 100%;
      text-align: right;
      overflow: hidden;
    }

    .preview {
      position: absolute;
      bottom: 5px;
      right: 20px;
      font-size: 24px;
      color: rgba($primary-color, 0.5);
    }
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: $accent-color;
    margin-left: 2px;
    animation: blink 1s infinite;
    vertical-align: baseline;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .calc-buttons {
    display: flex;
    flex-direction: column;
    gap: $gap-size;
    height: calc(100% - 110px);

    .calc-grid {
      display: flex;
      flex-direction: column;
      gap: $gap-size;
      flex: 1;
    }

    .calc-button-row {
      display: flex;
      gap: $gap-size;
      height: 100%;
    }
  }

  .move-buttons {
    display: flex;
    gap: $gap-size;
    margin-bottom: 10px;
  }

  .calc-button,
  .move-button {
    @include button-base;
    flex: 1;
    font-size: 24px;
    height: 65px;
    @include flex-center;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }

    &:active {
      background-color: $active-color;
      transform: translateY(0);
    }

    &.operator {
      background: $accent-color;
      color: white;

      &:hover {
        background: $accent-hover;
        color: white;
      }
    }

    &.double {
      flex: 2.1;
    }

    &.triple {
      flex: 3.2;
    }
  }

  .expression-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 40px;

    .current-expression {
      text-align: left;
      flex-grow: 1;
      margin-right: 10px;
    }
  }
</style>
