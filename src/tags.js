
export default class Tags {

    getTags() {

        return {
            "AAAA00003253": "125b151f-f6ab-4d07-8ce3-e4d3be8652e5",
            "AAAA00003255": "dbd16fd0-0ab3-44e4-a287-6c65895ede8b",
            "AAAA00003256": "bb85fa2b-fac6-4a6c-a27b-78f262c1bcfa",
            "AAAA00003259": "ef161695-ee72-4e60-9f5a-d9de338f4d50"
        }
    }

    findMatId(table, tagNumber) {
        if (table[tagNumber]) {
            return table[tagNumber];
        }
        return "-1";
    }

}

module.exports = Tags;