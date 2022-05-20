function getScanOrQueries() {
  const domNodes = {
    scanOrQuery: {
      selector: 'awsui-segmented-control[data-testid="query-scan-selector"]',
      getData: (node) => node.component.selectedId,
    },
    tableOrIndex: {
      selector: 'awsui-select[data-testid="table_index_selector"]',
      getData: (node) => node.component.selectedOption.id,
    },
    partitionKey: {
      selector: 'awsui-input[data-testid="form-query-pk"]',
      getData: (node) => node.component.value,
    },
    sortKeySelect: {
      selector: ".sortKeyFieldsContainer awsui-select",
      getData: (node) => node.component.selectedOption.id,
    },
    sortKeyInput: {
      selector: ".sortKeyInput awsui-input",
      getData: (node) => node.component.value,
    },
    sortKeyCheckbox: {
      selector: ".sortKeyCheckbox awsui-checkbox",
      getData: (node) => node.component.checked,
    },
    filters: {
      selector:
        '[data-testid="ordinary-filters-wrapper"] awsui-attribute-editor',
      getData: (node) => node.component.items,
    },
  };

  const table = document.querySelector(".bodyWrapper h1").textContent;

  const values = Object.entries(domNodes)
    .map(([key, controller]) => {
      const node = document.querySelector(controller.selector);
      if (!node) return;

      const value = controller.getData(node);
      return {
        key,
        value,
      };
    })
    .filter((item) => item?.value);

  localStorage.setItem(
    "DDB_QUERY_MANAGER_QUERIES",
    JSON.stringify({
      table,
      values,
    })
  );
}

getScanOrQueries();
