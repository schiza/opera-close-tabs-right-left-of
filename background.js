var leftButton, rightButton, extension = opera.extension, tabs = extension.tabs;

function closeTab(tab) {
  tabs.close(tab);
}

function isFocused(tab) {
  return tab.focused;
}

function closeTabsRightOfCurrent(current_tabs) {
  var i = current_tabs.map(isFocused).indexOf(true);
  current_tabs.slice(i + 1 - parseInt(widget.preferences.includeSelf)).forEach(closeTab);
}

function closeTabsLeftOfCurrent(current_tabs) {
  var i = current_tabs.map(isFocused).indexOf(true);
  current_tabs.slice(0, i + parseInt(widget.preferences.includeSelf)).forEach(closeTab);
}

function setupConnection() {
  extension.onmessage = function(event) {
    resetButtons();
  };

  extension.onconnect = function(event) {
    event.source.postMessage("hello");
  };
}

function resetButtons() {
  opera.contexts.toolbar.removeItem(leftButton);
  opera.contexts.toolbar.removeItem(rightButton);

  if (widget.preferences.option == '1') {
    opera.contexts.toolbar.addItem(leftButton);
  }
  else if (widget.preferences.option == '2') {
    opera.contexts.toolbar.addItem(rightButton);
  }
}

window.addEventListener('load', function() {

			  var leftProperties = {
			    disabled: false,
			    title: "Close tabs left of current",
			    icon: "icons/icon_left_18.png"
			  };

			  var rightProperties = {
			    disabled: false,
			    title: "Close tabs right of current",
			    icon: "icons/icon_right_18.png"
			  };

			  leftButton = opera.contexts.toolbar.createItem(leftProperties);
			  rightButton = opera.contexts.toolbar.createItem(rightProperties);

			  leftButton.onclick = function() {
			    closeTabsLeftOfCurrent(extension.windows.getFocused().tabs);
			  };
			  rightButton.onclick = function() {
			    closeTabsRightOfCurrent(extension.windows.getFocused().tabs);
			  };

			  setupConnection();

			  if (widget.preferences.option == undefined)
			    widget.preferences.option = '2'; //default: right

			  if (widget.preferences.includeSelf == undefined)
			    widget.preferences.includeSelf = 0; //default: no

			  resetButtons();

			}, false);

