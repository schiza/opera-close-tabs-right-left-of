var leftButton, rightButton, extension = opera.extension, tabs = extension.tabs, option = widget.preferences.option, includeSelf = parseInt(widget.preferences.includeSelf);

function closeTab(tab) {
  tabs.close(tab);
}

function isFocused(tab) {
  return tab.focused;
}

function closeTabsRightOfCurrent(current_tabs, current_tab) {
  var i = current_tabs.map(isFocused).indexOf(true);
  current_tabs.slice(i + 1 - includeSelf).forEach(closeTab);
}

function closeTabsLeftOfCurrent(current_tabs, current_tab) {
  var i = current_tabs.map(isFocused).indexOf(true);
  current_tabs.slice(0, i + includeSelf).forEach(closeTab);
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
			    closeTabsLeftOfCurrent(extension.windows.getFocused().tabs, tabs.getFocused());
			  };
			  rightButton.onclick = function() {
			    closeTabsRightOfCurrent(extension.windows.getFocused().tabs, tabs.getFocused());
			  };

			  setupConnection();

			  if (option == undefined)
			    option = '2'; //default: right

			  if (includeSelf == undefined)
			    includeSelf = 0; //default: no

			  resetButtons();

			}, false);

