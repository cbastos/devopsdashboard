export type Metric = {
    key: string,
    name: string,
    description: string,
    domain: string,
    type: string,
    higherValuesAreBetter: boolean,
    qualitative: boolean,
    hidden: boolean,
    custom: boolean
}

export type Measure = {
    metric: string,
    value: number,
    periods: [
        {
            index: number,
            value: number
        }
    ]
}

export type Component = {
    key: string,
    name: string,
    qualifier: string,
    language: string,
    path: string,
    measures: Measure[]
}