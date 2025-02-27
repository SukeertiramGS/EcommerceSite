class APIFeatures {
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }

    search(){
        let keyword = this.querystr.keyword ?{
            name:{
                $regex: this.querystr.keyword,
                $options : 'i' //case insensitive
            }
        }:{};

        this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy={...this.querystr};
        //removing fields from query
        const removeFields=['keyword','limit','page'];
        removeFields.forEach(field=>delete queryStrCopy[field]);

        let queryStr=JSON.stringify(queryStrCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`);
        
        this.query.find(JSON.parse(queryStr));
        return this;

    }

    paginate(resPerPage){
        const currentPage=Number(this.querystr.page) || 1;
        const skip=resPerPage * (currentPage -1);
        this.query.limit(resPerPage).skip(skip);
        return this;


    };
}

module.exports =APIFeatures;