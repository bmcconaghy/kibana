/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';

import { EuiContext } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';

interface EuiValues {
  [key: string]: any;
}

/**
 * Service that is responsible for i18n capabilities.
 * @internal
 */
export class I18nService {
  /**
   * Used exclusively to give a Context component to FatalErrorsService which
   * may render before Core successfully sets up or starts.
   *
   * Separated from `start` to disambiguate that this can be called from within
   * Core outside the lifecycle flow.
   * @internal
   */
  public getContext(): I18nStart {
    const mapping = {
      'euiBasicTable.selectAllRows': i18n.translate('core.euiBasicTable.selectAllRows', {
        defaultMessage: 'Select all rows',
        description: 'ARIA and displayed label on a checkbox to select all table rows',
      }),
      'euiBasicTable.selectThisRow': i18n.translate('core.euiBasicTable.selectThisRow', {
        defaultMessage: 'Select this row',
        description: 'ARIA and displayed label on a checkbox to select a single table row',
      }),
      '˜': ({ itemCount }: EuiValues) =>
        i18n.translate('core.euiBasicTable.tableDescription', {
          defaultMessage: 'Below is a table of {itemCount} items.',
          values: { itemCount },
          description: 'Screen reader text to describe the size of a table',
        }),
      'euiBottomBar.screenReaderAnnouncement': i18n.translate(
        'core.euiBottomBar.screenReaderAnnouncement',
        {
          defaultMessage:
            'There is a new menu opening with page level controls at the end of the document.',
          description:
            'Screen reader announcement that functionality is available in the page document',
        }
      ),
      'euiCardSelect.select': i18n.translate('core.euiCardSelect.select', {
        defaultMessage: 'Select',
        description: 'Displayed button text when a card option can be selected.',
      }),
      'euiCardSelect.selected': i18n.translate('core.euiCardSelect.selected', {
        defaultMessage: 'Selected',
        description: 'Displayed button text when a card option is selected.',
      }),
      'euiCardSelect.unavailable': i18n.translate('core.euiCardSelect.unavailable', {
        defaultMessage: 'Unavailable',
        description: 'Displayed button text when a card option is unavailable.',
      }),
      'euiCodeBlock.copyButton': i18n.translate('core.euiCodeBlock.copyButton', {
        defaultMessage: 'Copy',
        description: 'ARIA label for a button that copies source code text to the clipboard',
      }),
      'euiCodeEditor.startEditing': i18n.translate('core.euiCodeEditor.startEditing', {
        defaultMessage: 'Press Enter to start editing.',
      }),
      'euiCodeEditor.startInteracting': i18n.translate('core.euiCodeEditor.startInteracting', {
        defaultMessage: 'Press Enter to start interacting with the code.',
      }),
      'euiCodeEditor.stopEditing': i18n.translate('core.euiCodeEditor.stopEditing', {
        defaultMessage: "When you're done, press Escape to stop editing.",
      }),
      'euiCodeEditor.stopInteracting': i18n.translate('core.euiCodeEditor.stopInteracting', {
        defaultMessage: "When you're done, press Escape to stop interacting with the code.",
      }),
      'euiCollapsedItemActions.allActions': i18n.translate(
        'core.euiCollapsedItemActions.allActions',
        {
          defaultMessage: 'All actions',
          description:
            'ARIA label and tooltip content describing a button that expands an actions menu',
        }
      ),
      'euiColorPicker.screenReaderAnnouncement': i18n.translate(
        'core.euiColorPicker.screenReaderAnnouncement',
        {
          defaultMessage:
            'A popup with a range of selectable colors opened. Tab forward to cycle through colors choices or press escape to close this popup.',
          description:
            'Message when the color picker popover is opened. Describes the interaction with the elements in the popover.',
        }
      ),
      'euiColorPicker.swatchAriaLabel': ({ swatch }: EuiValues) =>
        i18n.translate('core.euiColorPicker.swatchAriaLabel', {
          defaultMessage: 'Select {swatch} as the color',
          values: { swatch },
          description:
            'Screen reader text to describe the action and hex value of the selectable option',
        }),
      'euiComboBoxOptionsList.allOptionsSelected': i18n.translate(
        'core.euiComboBoxOptionsList.allOptionsSelected',
        {
          defaultMessage: "You've selected all available options",
        }
      ),
      'euiComboBoxOptionsList.alreadyAdded': ({ label }: EuiValues) => (
        <FormattedMessage
          id="core.euiComboBoxOptionsList.alreadyAdded"
          defaultMessage="{label} has already been added"
          values={{ label }}
        />
      ),
      'euiComboBoxOptionsList.createCustomOption': ({ key, searchValue }: EuiValues) => (
        <FormattedMessage
          id="core.euiComboBoxOptionsList.createCustomOption"
          defaultMessage="Hit {key} to add {searchValue} as a custom option"
          values={{ key, searchValue }}
        />
      ),
      'euiComboBoxOptionsList.loadingOptions': i18n.translate(
        'core.euiComboBoxOptionsList.loadingOptions',
        {
          defaultMessage: 'Loading options',
          description: 'Placeholder message while data is asynchronously loaded',
        }
      ),
      'euiComboBoxOptionsList.noAvailableOptions': i18n.translate(
        'core.euiComboBoxOptionsList.noAvailableOptions',
        {
          defaultMessage: "There aren't any options available",
        }
      ),
      'euiComboBoxOptionsList.noMatchingOptions': ({ searchValue }: EuiValues) => (
        <FormattedMessage
          id="core.euiComboBoxOptionsList.noMatchingOptions"
          defaultMessage="{searchValue} doesn't match any options"
          values={{ searchValue }}
        />
      ),
      'euiComboBoxPill.removeSelection': ({ children }: EuiValues) =>
        i18n.translate('core.euiComboBoxPill.removeSelection', {
          defaultMessage: 'Remove {children} from selection in this group',
          values: { children },
          description: 'ARIA label, `children` is the human-friendly value of an option',
        }),
      'euiFilterButton.filterBadge': ({ count, hasActiveFilters }: EuiValues) =>
        i18n.translate('core.euiFilterButton.filterBadge', {
          defaultMessage: '${count} ${filterCountLabel} filters',
          values: { count, filterCountLabel: hasActiveFilters ? 'active' : 'available' },
        }),
      'euiForm.addressFormErrors': i18n.translate('core.euiForm.addressFormErrors', {
        defaultMessage: 'Please address the errors in your form.',
      }),
      'euiFormControlLayoutClearButton.label': i18n.translate(
        'core.euiFormControlLayoutClearButton.label',
        {
          defaultMessage: 'Clear input',
          description: 'ARIA label on a button that removes any entry in a form field',
        }
      ),
      'euiHeaderAlert.dismiss': i18n.translate('core.euiHeaderAlert.dismiss', {
        defaultMessage: 'Dismiss',
        description: 'ARIA label on a button that dismisses/removes a notification',
      }),
      'euiHeaderLinks.appNavigation': i18n.translate('core.euiHeaderLinks.appNavigation', {
        defaultMessage: 'App navigation',
        description: 'ARIA label on a `nav` element',
      }),
      'euiHeaderLinks.openNavigationMenu': i18n.translate(
        'core.euiHeaderLinks.openNavigationMenu',
        {
          defaultMessage: 'Open navigation menu',
        }
      ),
      'euiHue.label': i18n.translate('core.euiHue.label', {
        defaultMessage: 'Select the HSV color mode "hue" value',
      }),
      'euiModal.closeModal': i18n.translate('core.euiModal.closeModal', {
        defaultMessage: 'Closes this modal window',
      }),
      'euiPagination.jumpToLastPage': ({ pageCount }: EuiValues) =>
        i18n.translate('core.euiPagination.jumpToLastPage', {
          defaultMessage: 'Jump to the last page, number {pageCount}',
          values: { pageCount },
        }),
      'euiPagination.nextPage': i18n.translate('core.euiPagination.nextPage', {
        defaultMessage: 'Next page',
      }),
      'euiPagination.pageOfTotal': ({ page, total }: EuiValues) =>
        i18n.translate('core.euiPagination.pageOfTotal', {
          defaultMessage: 'Page {page} of {total}',
          values: { page, total },
        }),
      'euiPagination.previousPage': i18n.translate('core.euiPagination.previousPage', {
        defaultMessage: 'Previous page',
      }),
      'euiPopover.screenReaderAnnouncement': i18n.translate(
        'core.euiPopover.screenReaderAnnouncement',
        {
          defaultMessage: 'You are in a popup. To exit this popup, hit Escape.',
        }
      ),
      'euiSaturation.roleDescription': i18n.translate('core.euiSaturation.roleDescription', {
        defaultMessage: 'HSV color mode saturation and value selection',
      }),
      'euiSaturation.screenReaderAnnouncement': i18n.translate(
        'core.euiSaturation.screenReaderAnnouncement',
        {
          defaultMessage:
            'Use the arrow keys to navigate the square color gradient. The coordinates resulting from each key press will be used to calculate HSV color mode "saturation" and "value" numbers, in the range of 0 to 1. Left and right decrease and increase (respectively) the "saturation" value. Up and down decrease and increase (respectively) the "value" value.',
        }
      ),
      'euiSelectable.loadingOptions': i18n.translate('core.euiSelectable.loadingOptions', {
        defaultMessage: 'Loading options',
        description: 'Placeholder message while data is asynchronously loaded',
      }),
      'euiSelectable.noAvailableOptions': i18n.translate('core.euiSelectable.noAvailableOptions', {
        defaultMessage: "There aren't any options available",
      }),
      'euiSelectable.noMatchingOptions': ({ searchValue }: EuiValues) => (
        <FormattedMessage
          id="core.euiSelectable.noMatchingOptions"
          defaultMessage="{searchValue} doesn't match any options"
          values={{ searchValue }}
        />
      ),
      'euiStat.loadingText': i18n.translate('core.euiStat.loadingText', {
        defaultMessage: 'Statistic is loading',
      }),
      'euiStep.completeStep': i18n.translate('core.euiStep.completeStep', {
        defaultMessage: 'Step',
        description:
          'See https://elastic.github.io/eui/#/navigation/steps to know how Step control looks like',
      }),
      'euiStep.incompleteStep': i18n.translate('core.euiStep.incompleteStep', {
        defaultMessage: 'Incomplete Step',
      }),
      'euiStepHorizontal.buttonTitle': ({ step, title, disabled, isComplete }: EuiValues) => {
        return i18n.translate('core.euiStepHorizontal.buttonTitle', {
          defaultMessage:
            'Step {step}: {title}{titleAppendix, select, completed { is completed} disabled { is disabled} other {}}',
          values: {
            step,
            title,
            titleAppendix: disabled ? 'disabled' : isComplete ? 'completed' : '',
          },
        });
      },
      'euiStepHorizontal.step': i18n.translate('core.euiStepHorizontal.step', {
        defaultMessage: 'Step',
        description: 'Screen reader text announcing information about a step in some process',
      }),
      'euiStepNumber.hasErrors': i18n.translate('core.euiStepNumber.hasErrors', {
        defaultMessage: 'has errors',
        description:
          'Used as the title attribute on an image or svg icon to indicate a given process step has errors',
      }),
      'euiStepNumber.hasWarnings': i18n.translate('core.euiStepNumber.hasWarnings', {
        defaultMessage: 'has warnings',
        description:
          'Used as the title attribute on an image or svg icon to indicate a given process step has warnings',
      }),
      'euiStepNumber.isComplete': i18n.translate('core.euiStepNumber.isComplete', {
        defaultMessage: 'complete',
        description:
          'Used as the title attribute on an image or svg icon to indicate a given process step is complete',
      }),
      'euiSuperDatePicker.showDatesButtonLabel': i18n.translate(
        'core.euiSuperDatePicker.showDatesButtonLabel',
        {
          defaultMessage: 'Show dates',
          description: 'Displayed in a button that shows date picker',
        }
      ),
      'euiSuperSelect.screenReaderAnnouncement': ({ optionsCount }: EuiValues) =>
        i18n.translate('core.euiSuperSelect.screenReaderAnnouncement', {
          defaultMessage:
            'You are in a form selector of {optionsCount} items and must select a single option. Use the Up and Down keys to navigate or Escape to close.',
          values: { optionsCount },
        }),
      'euiSuperSelectControl.selectAnOption': ({ selectedValue }: EuiValues) =>
        i18n.translate('core.euiSuperSelectControl.selectAnOption', {
          defaultMessage: 'Select an option: {selectedValue}, is selected',
          values: { selectedValue },
        }),
      'euiSuperUpdateButton.cannotUpdateTooltip': i18n.translate(
        'core.euiSuperUpdateButton.cannotUpdateTooltip',
        {
          defaultMessage: 'Cannot update',
          description: "Displayed in a tooltip when updates can't happen",
        }
      ),
      'euiSuperUpdateButton.clickToApplyTooltip': i18n.translate(
        'core.euiSuperUpdateButton.clickToApplyTooltip',
        {
          defaultMessage: 'Click to apply',
          description: "Displayed in a tooltip when there are changes that haven't been applied",
        }
      ),
      'euiSuperUpdateButton.refreshButtonLabel': i18n.translate(
        'core.euiSuperUpdateButton.refreshButtonLabel',
        {
          defaultMessage: 'Refresh',
          description: 'Displayed in a button that refreshes based on date picked',
        }
      ),
      'euiSuperUpdateButton.updatingButtonLabel': i18n.translate(
        'core.euiSuperUpdateButton.updatingButtonLabel',
        {
          defaultMessage: 'Updating',
          description: 'Displayed in a button that refreshes when updates are happening',
        }
      ),
      'euiSuperUpdateButton.updateButtonLabel': i18n.translate(
        'core.euiSuperUpdateButton.updateButtonLabel',
        {
          defaultMessage: 'Uodate',
          description: 'Displayed in a button that updates based on date picked',
        }
      ),
      'euiTablePagination.rowsPerPage': i18n.translate('core.euiTablePagination.rowsPerPage', {
        defaultMessage: 'Rows per page',
        description: 'Displayed in a button that toggles a table pagination menu',
      }),
      'euiTablePagination.rowsPerPageOption': ({ rowsPerPage }: EuiValues) =>
        i18n.translate('core.euiTablePagination.rowsPerPageOption', {
          defaultMessage: '{rowsPerPage} rows',
          description: 'Displayed in a button that toggles the number of visible rows',
          values: { rowsPerPage },
        }),
      'euiTableSortMobile.sorting': i18n.translate('core.euiTableSortMobile.sorting', {
        defaultMessage: 'Sorting',
        description: 'Displayed in a button that toggles a table sorting menu',
      }),
      'euiToast.dismissToast': i18n.translate('core.euiToast.dismissToast', {
        defaultMessage: 'Dismiss toast',
      }),
      'euiToast.newNotification': i18n.translate('core.euiToast.newNotification', {
        defaultMessage: 'A new notification appears',
      }),
      'euiToast.notification': i18n.translate('core.euiToast.notification', {
        defaultMessage: 'Notification',
        description: 'ARIA label on an element containing a notification',
      }),
    };

    return {
      Context: function I18nContext({ children }) {
        return (
          <I18nProvider>
            <EuiContext i18n={{ mapping }}>{children}</EuiContext>
          </I18nProvider>
        );
      },
    };
  }

  public start(): I18nStart {
    return this.getContext();
  }

  public stop() {
    // nothing to do here currently
  }
}

/**
 * I18nStart.Context is required by any localizable React component from \@kbn/i18n and \@elastic/eui packages
 * and is supposed to be used as the topmost component for any i18n-compatible React tree.
 *
 * @public
 *
 */
export interface I18nStart {
  /**
   * React Context provider required as the topmost component for any i18n-compatible React tree.
   */
  Context: ({ children }: { children: React.ReactNode }) => JSX.Element;
}
