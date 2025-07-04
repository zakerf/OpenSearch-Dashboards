/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

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

// @ts-expect-error TS6133 TODO(ts-error): fixme
import { EuiListGroupItem, EuiConfirmModal, EuiIconTip } from '@elastic/eui';

import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { i18n } from '@osd/i18n';
import { SavedQuery } from '../..';
import { DeleteSavedQueryConfirmationModal } from './delete_saved_query_confirmation_modal';

interface Props {
  savedQuery: SavedQuery;
  isSelected: boolean;
  showWriteOperations: boolean;
  onSelect: (savedQuery: SavedQuery) => void;
  onDelete: (savedQuery: SavedQuery) => void;
}

export const SavedQueryListItem = ({
  savedQuery,
  isSelected,
  onSelect,
  onDelete,
  showWriteOperations,
}: Props) => {
  const [showDeletionConfirmationModal, setShowDeletionConfirmationModal] = useState(false);

  const selectButtonAriaLabelText = isSelected
    ? i18n.translate(
        'data.search.searchBar.savedQueryPopoverSavedQueryListItemSelectedButtonAriaLabel',
        {
          defaultMessage:
            'Saved query button selected {savedQueryName}. Press to clear any changes.',
          values: { savedQueryName: savedQuery.attributes.title },
        }
      )
    : i18n.translate('data.search.searchBar.savedQueryPopoverSavedQueryListItemButtonAriaLabel', {
        defaultMessage: 'Saved query button {savedQueryName}',
        values: { savedQueryName: savedQuery.attributes.title },
      });

  const selectButtonDataTestSubj = isSelected
    ? `load-saved-query-${savedQuery.attributes.title}-button saved-query-list-item-selected`
    : `load-saved-query-${savedQuery.attributes.title}-button`;

  const classes = classNames('osdSavedQueryListItem', {
    'osdSavedQueryListItem-selected': isSelected,
  });

  const label = (
    <span className="osdSavedQueryListItem__label" data-test-subj="osdSavedQueryListItemLabel">
      <span className="osdSavedQueryListItem__labelText">{savedQuery.attributes.title}</span>{' '}
      {savedQuery.attributes.description && (
        <EuiIconTip
          type="iInCircle"
          content={savedQuery.attributes.description}
          aria-label={i18n.translate(
            'data.search.searchBar.savedQueryPopoverSavedQueryListItemDescriptionAriaLabel',
            {
              defaultMessage: '{savedQueryName} description',
              values: { savedQueryName: savedQuery.attributes.title },
            }
          )}
        />
      )}
    </span>
  );

  return (
    <Fragment>
      <EuiListGroupItem
        size="s"
        className={classes}
        key={savedQuery.id}
        data-test-subj={`saved-query-list-item ${selectButtonDataTestSubj} ${
          isSelected ? 'saved-query-list-item-selected' : ''
        }`}
        isActive={isSelected}
        onClick={() => {
          onSelect(savedQuery);
        }}
        aria-label={selectButtonAriaLabelText}
        label={label}
        iconType={isSelected ? 'check' : undefined}
        extraAction={
          showWriteOperations
            ? {
                color: 'danger',
                onClick: () => setShowDeletionConfirmationModal(true),
                iconType: 'trash',
                iconSize: 's',
                'aria-label': i18n.translate(
                  'data.search.searchBar.savedQueryPopoverDeleteButtonAriaLabel',
                  {
                    defaultMessage: 'Delete saved query {savedQueryName}',
                    values: { savedQueryName: savedQuery.attributes.title },
                  }
                ),
                title: i18n.translate(
                  'data.search.searchBar.savedQueryPopoverDeleteButtonAriaLabel',
                  {
                    defaultMessage: 'Delete saved query {savedQueryName}',
                    values: { savedQueryName: savedQuery.attributes.title },
                  }
                ),
                'data-test-subj': `delete-saved-query-${savedQuery.attributes.title}-button`,
              }
            : undefined
        }
      />

      {showDeletionConfirmationModal && (
        <DeleteSavedQueryConfirmationModal
          savedQuery={savedQuery}
          onConfirm={() => {
            onDelete(savedQuery);
            setShowDeletionConfirmationModal(false);
          }}
          onCancel={() => {
            setShowDeletionConfirmationModal(false);
          }}
        />
      )}
    </Fragment>
  );
};
