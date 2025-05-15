'use client';


import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import * as ReactDndTouchBackend from 'react-dnd-touch-backend';
import type { DefaultOperators, Field, RuleGroupType, RuleType } from 'react-querybuilder';
import { defaultValidator, QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import '@/styles/styles.css';
import { QueryBuilderAntD } from '@react-querybuilder/antd';
import '@ant-design/v5-patch-for-react-19';

export const validator = (r: RuleType) => !!r.value;


export const defaultOperators: DefaultOperators = [
  { name: '=', value: '=', label: '=' },
  { name: '!=', value: '!=', label: '!=' },
  { name: '<', value: '<', label: '<' },
  { name: '>', value: '>', label: '>' },
  { name: '<=', value: '<=', label: '<=' },
  { name: '>=', value: '>=', label: '>=' },
  { name: 'null', value: 'null', label: 'is null' },
  { name: 'notNull', value: 'notNull', label: 'is not null' },
  { name: 'between', value: 'between', label: 'between' },
  { name: 'notBetween', value: 'notBetween', label: 'not between' },
];


const fields: Field[] = [
  { name: 'totalSpend', label: 'Total Spend', type: 'number',placeholder: 'Enter Total Spend',validator },
  { name: 'visits', label: 'Visits', type: 'number',placeholder: 'Enter no. of visits',validator },
  { name: 'lastVisit', label: 'Last Visit',placeholder: 'Enter last visit', inputType: 'date',datatype: 'date',validator },
];

type QueryType={
  query:RuleGroupType,
  setQuery:React.Dispatch<React.SetStateAction<RuleGroupType<RuleType<string, string, unknown, string>, string>>>
}

export default function RuleBuilder({
  query,setQuery
}:QueryType) {
  


  return (
    <QueryBuilderDnD
      dnd={{ ...ReactDnD, ...ReactDndHtml5Backend, ...ReactDndTouchBackend }}
    >
      <QueryBuilderAntD>
        <QueryBuilder
          operators={defaultOperators}
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          showShiftActions
          validator={defaultValidator}
          controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
        />
      </QueryBuilderAntD>
    </QueryBuilderDnD>
  );
}
