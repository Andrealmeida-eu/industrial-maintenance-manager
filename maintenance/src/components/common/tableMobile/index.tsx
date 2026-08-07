import React from 'react';
import { FiUser, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/router';

export interface ColumnConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface FieldConfig {
  label: string;
  key: string;
  format?: (value: any) => string;
}

interface TagConfig<T> {
  label: string;
  key: keyof T;
  color: string | ((item: T) => string);
  defaultValue?: any;
  prefix?: string;
  format?: (value: any, item: T) => string;
}

interface ActionConfig {
 itemAtivo?: boolean
  label?: string;
  color: string;
  onClick: (item: any) => void;
  icon?: React.ReactNode;
  disabled?: boolean
}

interface CardListProps {
  data: any[];
  columnsConfig?: ColumnConfig;
  titleField?: string;
  subtitleField?: string;
  fields?: FieldConfig[];
  tags?: TagConfig<any>[];
  actions?: ActionConfig[];
  emptyMessage?: string;
  icon?: React.ReactNode;
  iconColor?: string;

  hiddenBreakpoint?: 'mobile' | 'tablet' | 'desktop' | 'widescreen' | 'fullhd' | 'none';
}

const CardList: React.FC<CardListProps> = ({
  data = [],
  columnsConfig = {
    mobile: 12,
    tablet: 6,
    desktop: 4
  },
  titleField = 'nome',
  subtitleField = 'email',
  fields = [
    { label: 'Telefone', key: 'telefone' },
    { label: 'E-mail', key: 'email' },
    { label: 'Cadastro', key: 'dataCadastro', format: (value: string | null) => value || '' }
  ],
  tags = [
    { label: 'Pedidos', key: 'pedidosRealizados', color: 'is-info', defaultValue: 0 },
    { label: 'Total', key: 'totalGasto', color: 'is-success', defaultValue: 0, prefix: 'R$ ' }
  ],
  actions = [
    {
      label: 'Todos Pedidos',
      color: 'is-info is-light',
      onClick: (item: any) => { },
      icon: null,
      itemAtivo: true
   

    },
    {
      label: '',
      color: 'is-warning is-light',
      onClick: (item: any) => { },
      icon: <FiEdit />,
            itemAtivo: true
    
    },
    {
      label: '',
      color: 'is-danger is-light',
      onClick: (item: any) => { },
      disabled: false,
      icon: <FiTrash2 />,
            itemAtivo: true

    }
  ],
  hiddenBreakpoint = 'tablet',
  emptyMessage = 'Nenhum item encontrado',
  icon = <FiUser />,
  iconColor = 'has-text-primary'
}) => {
  const router = useRouter();

  const getColumnClass = (config: ColumnConfig): string => {
    return `column is-${config.mobile}-mobile is-${config.tablet}-tablet is-${config.desktop}-desktop`;
  };

  // Função para gerar a classe de visibilidade
  const getVisibilityClass = (): string => {
    if (hiddenBreakpoint === 'none') return '';
    return `is-hidden-${hiddenBreakpoint}`;
  };

  const formatValue = (value: any, format?: (value: any) => string): string => {
    if (format && typeof format === 'function') {
      return format(value);
    }
    return value != null ? String(value) : '';
  };

  const getTagValue = (item: any, tag: TagConfig<any>): any => {
    const value = item[tag.key];
    return value != null ? value : tag.defaultValue || 0;
  };

  // Função para resolver a cor da tag (pode ser string ou função)
  const resolveTagColor = (tag: TagConfig<any>, item: any): string => {
    if (typeof tag.color === 'function') {
      return tag.color(item);
    }
    return tag.color;
  };

  // Função para formatar o valor da tag
  const formatTagValue = (tag: TagConfig<any>, item: any): string => {
    const value = getTagValue(item, tag);
    if (tag.format && typeof tag.format === 'function') {
      return tag.format(value, item);
    }
    return String(value);
  };

  return (
    <div className={`columns is-multiline ${getVisibilityClass()}`} style={{
        display: 'flex',
           marginTop: '15px',
           marginBottom: '.75em',
        alignItems: 'stretch',
        flexDirection:'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'flex-start'

    }}>
      {data.length > 0 ? data.map(item => (
        <div key={item.id} className={getColumnClass(columnsConfig)} style={{display: 'grid', overflow: 'none'}}>
          <div className="card" style={{ paddingTop: '1rem' }}>
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <span className={`icon ${iconColor}`}>
                    {icon}
                  </span>
                </div>
                <div className="media-content" style={{overflowX: 'clip'}}>
                  <p className="title is-5">{item[titleField]}</p>
                  {subtitleField && (
                    <p className="subtitle is-7">{item[subtitleField]}</p>
                  )}
                </div>
              </div>

              <div className="content">
                {fields.map((field: FieldConfig, index: number) => (
                  <div key={index} className=" is-size-7 mb-2">
                    <span><strong>{field.label} </strong></span>
                    <span>{formatValue(item[field.key], field.format)}</span>
                  </div>
                ))}

                {tags.length > 0 && (
                  <>
                    <hr className="my-3" />
                    <div className="field is-grouped is-grouped-multiline">
                      {tags.map((tag: TagConfig<any>, index: number) => {
                        const tagColor = resolveTagColor(tag, item);
                        const tagValue = formatTagValue(tag, item);

                        return (
                          <div key={index} className="control">
                            <div className="tags has-addons">
                              <span className="tag is-dark">{tag.label}</span>
                              <span className={`tag ${tagColor}`}>
                                {tag.prefix || ''}{tagValue}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {actions.length > 0 &&  (
                  <div className="buttons are-small mt-3">
                    {actions.map((action: ActionConfig, index: number) => (
                      action.itemAtivo && 
                      <button
                        key={index}
                        className={`button ${action.color}`}
                        onClick={() => action.onClick(item)}
                        disabled={action.disabled}
                      >
                        {action.icon}
                        {action.label && <span>{action.label}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="column is-12">
          <div className="notification is-light">
            {emptyMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;