function setSelectedGroupOption(node, value) {
  node.component.options.forEach((items) => {
    const selectedOption = items.options.find((item) => item.id === value);
    if (!selectedOption) return;
    node.component.controller.interactionHandler.selectionListener({
      stopPropagation() {},
      detail: selectedOption,
    });
  });
}

function setSelectedOption(node, value) {
  node.component.options.forEach((detail) => {
    if (!detail.id === value) return;
    node.component.controller.interactionHandler.selectionListener({
      stopPropagation() {},
      detail,
    });
  });
}

function setInputValue(node, value) {
  node.component.__controller._inputListener({ target: { value } });
}

function setCheckedValue(node, checked) {
  node.component.__fireEvent("change", { checked });
}

function setToggleValue(node, value) {
  const selectedButton = node.component.options.find(
    (item) => item.id === value
  );
  if (!selectedButton) return;

  node.querySelectorAll("button").forEach((item) => {
    if (item.textContent !== selectedButton.text) return;
    item.click();
  });
}

function getDomNodes() {
  return {
    scanOrQuery: {
      selector: 'awsui-segmented-control[data-testid="query-scan-selector"]',
      loadData: setToggleValue,
    },
    tableOrIndex: {
      selector: 'awsui-select[data-testid="table_index_selector"]',
      loadData: setSelectedGroupOption,
    },
    partitionKey: {
      selector: 'awsui-input[data-testid="form-query-pk"]',
      loadData: setInputValue,
    },
    sortKeySelect: {
      selector: ".sortKeyFieldsContainer awsui-select",
      loadData: setSelectedOption,
    },
    sortKeyInput: {
      selector: ".sortKeyInput awsui-input",
      loadData: setInputValue,
    },
    sortKeyCheckbox: {
      selector: ".sortKeyCheckbox awsui-checkbox",
      loadData: setCheckedValue,
    },
    filters: {
      selector:
        '[data-testid="ordinary-filters-wrapper"] awsui-attribute-editor',
      loadData: async (node, items = []) => {
        await expandSection(
          '[data-testid="ordinary-filters-wrapper"] awsui-expandable-section'
        );

        // Remove all fields first
        node
          .querySelectorAll(".awsui-form-field-secondary-control awsui-button")
          .forEach(() => {
            node.component.__fireEvent("removeButtonClick", {
              itemIndex: 0,
            });
          });

        // Add fields
        items.forEach(() => {
          node.component.__fireEvent("addButtonClick");
        });

        const formFields = [
          {
            selector: '[data-testid="filter-attr-name"]',
            field: "name",
            loadData: setInputValue,
          },
          {
            selector: '[data-testid="filter-value"]',
            field: "value",
            loadData: setInputValue,
          },
        ];

        // Input data
        node
          .querySelectorAll(".awsui-attribute-editor__row > awsui-form-field")
          .forEach((formFieldNode, index) => {
            const data = items[index];
            if (!data) return;

            formFields.forEach(async (item) => {
              const inputNode = formFieldNode.querySelector(item.selector);
              if (!inputNode) return;

              const value = data[item.field];
              await item.loadData(inputNode, value);
            });
          });
      },
    },
  };
}

function updateDOMValues(values = []) {
  const domNodes = getDomNodes();

  values.forEach(async ({ key, value }) => {
    const controller = domNodes[key];
    if (!controller) return;

    const node = document.querySelector(controller.selector);
    if (!node) return;

    await controller.loadData(node, value);
  });
}

function expandSection(selector) {
  return new Promise((resolve) => {
    const expandableComponent = document.querySelector(selector);
    if (!expandableComponent || expandableComponent.component.expanded) {
      resolve();
      return;
    }

    expandableComponent
      .querySelector(`#${expandableComponent.component.triggerControlId}`)
      .click();

    let intervalCount = 0;
    const interval = setInterval(() => {
      if (expandableComponent.component.expanded || intervalCount >= 10000) {
        resolve();
        clearInterval(interval);
      }
      intervalCount++;
    }, 50);
  });
}

async function loadData() {
  const table = document.querySelector(".bodyWrapper h1").textContent;

  try {
    const loadJSON = localStorage.getItem("DDB_QM_CURRENT_LOAD_JSON");
    let loadKey = "";
    let loadedData;

    if (!loadJSON) {
      // Load data from storage
      loadKey = localStorage.getItem("DDB_QM_CURRENT_LOAD_KEY");
      if (!loadKey) throw new Error("DDB_QUERY_MANAGER invalid data");

      const dataFromStorage = localStorage.getItem(loadKey);
      if (!dataFromStorage)
        throw new Error("DDB_QUERY_MANAGER data not found in storage");
      loadedData = JSON.parse(dataFromStorage);
    } else {
      // Load data from JSON file
      loadedData = JSON.parse(loadJSON);
    }

    if (!loadedData.table)
      throw new Error("DDB_QUERY_MANAGER invalid data, missing table");

    if (loadedData.table !== table)
      throw new Error("DDB_QUERY_MANAGER table is not match");

    await expandSection(".bodyWrapper awsui-expandable-section");
    updateDOMValues(loadedData.values);
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.setItem("DDB_QM_CURRENT_LOAD_STATUS", true);
  }
}

loadData();
