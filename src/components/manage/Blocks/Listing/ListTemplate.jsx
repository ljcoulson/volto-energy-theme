import React, { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import config from '@plone/volto/registry';
import { Item, Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getBaseUrl } from '@plone/volto/helpers';
import { getContent } from '@plone/volto/actions';

const getPath = (url) => {
  return url
    .replace(config.settings.apiPath, '')
    .replace(config.settings.internalApiPath, '');
};

const ListTemplate = (props) => {
  const { block, data = {}, isEditMode } = props;

  const sort_on =
    (isEditMode ? props.sort_on : props.content?.sort_on) || 'created';

  const items = isEditMode ? props.items : props.content?.items;

  const dispatch = useDispatch();
  useEffect(() => {
    loadContent();
  }, []);

  const getRequestKey = () => {
    return `col-content:${block}`;
  };

  const loadContent = () => {
    const path = isEditMode ? props.pathname : data.collection_url;
    if (!path) return;
    const url = `${getBaseUrl(path)}`;
    const options = {
      metadata_fields: '_all',
      is_search: 1,
    };
    dispatch(getContent(url, null, getRequestKey(), options));
  };

  const searchItems = items?.sort(
    (a, b) => new Date(b[sort_on]) - new Date(a[sort_on]),
  );

  return (
    <div>
      {searchItems &&
        searchItems.map((item, index) => (
          <Item className="search-item" key={item['@id']}>
            <Item.Content>
              <Item.Description>
                <div className="descriptionBody">
                  <Link style={{ color: '#444' }} to={item['@id'] || item.url}>
                    <h4 className="item-description">
                      {item.description || item.title || item.Title}
                    </h4>
                  </Link>
                </div>
                <div className="searchMetadata">
                  {item.topics && (
                    <div>
                      <span className="searchLabel black">Topic:</span>{' '}
                      {item.topics?.join(', ')}
                    </div>
                  )}
                  <div>
                    <span className="searchLabel black">Published:</span>{' '}
                    <FormattedDate
                      value={item[sort_on]}
                      day="2-digit"
                      month="long"
                      year="numeric"
                    />
                  </div>
                  <div>
                    <span className="searchLabel black">Location:</span>{' '}
                    {item['@components'] &&
                      item['@components']?.breadcrumbs.items && (
                        <Breadcrumb style={{ display: 'inline' }}>
                          {item['@components'].breadcrumbs.items
                            .slice(0, -1)
                            .map((item, index, items) => [
                              index < items.length - 1 ? (
                                <Breadcrumb.Section>
                                  <Link
                                    key={item.url}
                                    to={getPath(item['@id'])}
                                  >
                                    {item.title}
                                  </Link>
                                  <Breadcrumb.Divider
                                    key={`divider-${item.url}`}
                                  />
                                </Breadcrumb.Section>
                              ) : (
                                <Breadcrumb.Section>
                                  <Link
                                    key={item.url}
                                    to={getPath(item['@id'])}
                                  >
                                    {item.title}
                                  </Link>
                                </Breadcrumb.Section>
                              ),
                            ])}
                        </Breadcrumb>
                      )}
                  </div>
                </div>
              </Item.Description>
            </Item.Content>
          </Item>
        ))}
    </div>
  );
};

ListTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default ListTemplate;
