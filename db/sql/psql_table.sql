CREATE USER ec_dev WITH PASSWORD 'ec_dev_2023';
CREATE DATABASE zk_mall owner ec_dev;
GRANT ALL ON DATABASE zk_mall TO ec_dev; 

-- CREATE FUNCTION UPDATE_TIMESTAMP_FUNC
create or replace function update_timestamp_func() returns trigger as $$ begin new.updated_at = current_timestamp;
return new;
end $$ language plpgsql;



-- ----------------------------
-- Table structure for date_base
-- ----------------------------
DROP TABLE IF EXISTS "public"."date_base";
CREATE TABLE "public"."date_base" (
    id integer NOT NULL,
    day integer NOT NULL,
    week integer NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    y_month integer NOT NULL,
    y_week integer NOT NULL,
    PRIMARY KEY (id)
);
SELECT cron.schedule('add_date_sdl', '0 16 * * *', $$insert into date_base (id,day,week,month,year,y_month,y_week) values
( CAST (to_char(current_timestamp, 'YYYYMMDD') AS NUMERIC)  ,
CAST(ltrim(to_char(current_timestamp, 'DD'),'0') AS NUMERIC) ,
CAST(ltrim(to_char(current_timestamp, 'WW'),'0')  AS NUMERIC) ,
CAST(ltrim(to_char(current_timestamp, 'MM'),'0') AS NUMERIC) ,
CAST(to_char(current_timestamp, 'YYYY') AS NUMERIC),
CAST(to_char(current_timestamp, 'YYYYMM') AS NUMERIC) ,
CAST(to_char(current_timestamp, 'YYYYWW') AS NUMERIC));$$);


-- ----------------------------
-- Table structure for admin_info
-- ----------------------------
DROP TABLE IF EXISTS "public"."admin_info";
CREATE TABLE "public"."admin_info" (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "last_login_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL,
    "user_name" character varying(50),
    "password" character varying(200) NOT NULL,
    "avatar" character varying(200) ,
    "phone" character varying(50) NOT NULL,
    "email" character varying(100),
    "gender" smallint,
    "type" int4 NOT NULL,
    PRIMARY KEY (id)
);
create trigger admin_info_upt before
update on admin_info for each row execute procedure update_timestamp_func();
select setval('admin_info_id_seq', 1000, false);

CREATE UNIQUE INDEX admin_phohe_unique ON admin_info (phone); 

-- ----------------------------
-- Table structure for admin_type
-- ----------------------------
CREATE TABLE "public"."admin_type" (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "type_name" character varying(50) NOT NULL,
    "menu_list" jsonb NOT NULL DEFAULT '{}',
    "remark" character varying(400),
    PRIMARY KEY (id)
);
create trigger admin_type_upt before
update on admin_type for each row execute procedure update_timestamp_func();
select setval('admin_type_id_seq', 1000, false);


-- -----------------------------------
-- Table structure for base_providence
-- -----------------------------------
CREATE TABLE public.base_providence (
    "id" serial NOT NULL,
    "status" int2 NOT NULL,
    "name" varchar(20) NOT NULL,
    CONSTRAINT base_providence_pk PRIMARY KEY (id)
);
-- -----------------------------------
-- Table structure for base_city
-- -----------------------------------
CREATE TABLE public.base_city (
    "id" serial NOT NULL,
    "p_id" serial NOT NULL,
    "status" int2 NOT NULL,
    "name" varchar(20) NOT NULL,
    CONSTRAINT base_city_pk PRIMARY KEY (id)
);
-- -----------------------------------
-- Table structure for base_city
-- -----------------------------------
CREATE TABLE public.base_area (
    "id" serial NOT NULL,
    "p_id" serial NOT NULL,
    "c_id" serial NOT NULL,
    "status" int2 NOT NULL,
    "name" varchar(20) NOT NULL,
    CONSTRAINT base_area_pk PRIMARY KEY (id)
);

-- -----------------------------------
-- Table structure for base_brand
-- -----------------------------------
CREATE TABLE public.base_brand (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL,
    "admin_id" int8 NULL,
    "user_id" int8 NULL,
    "name" varchar(20) NOT NULL,
    "img" varchar(80)  NULL,
    "seq" int8 NULL,
    "content" text NULL,
    "remarks" varchar(200) NULL,
    CONSTRAINT base_brand_pk PRIMARY KEY (id)
);

create trigger base_brand_upt before
update on base_brand for each row execute procedure update_timestamp_func();
select setval('base_brand_id_seq', 100000, false);


-- -----------------------------------
-- Table structure for base_category
-- -----------------------------------
CREATE TABLE public.base_category (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL,
    "admin_id" int8 NULL,
    "user_id" int8 NULL,
    "p_id" int8 NULL,
    "level" int2 NULL,
    "name" varchar(20) NOT NULL,
    "icon" varchar(80)  NULL,
    "img" varchar(80)  NULL,
    "seq" int8 NULL,
    "content" text NULL,
    "remarks" varchar(200) NULL,
    CONSTRAINT base_category_pk PRIMARY KEY (id)
);

create trigger base_category_upt before
update on base_category for each row execute procedure update_timestamp_func();
select setval('base_category_id_seq', 100000, false);


-- -----------------------------------
-- Table structure for base_swiper
-- -----------------------------------
CREATE TABLE public.base_swiper (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL,
    "admin_id" int8 NULL,
    "img" varchar(80)  NULL,
    "title" varchar(80)  NULL,
    "link" varchar(80)  NULL,
    "type" int2  NULL,
    "seq" int8 NULL,
    "content" text NULL,
    "remarks" varchar(200) NULL,
    CONSTRAINT base_swiper_pk PRIMARY KEY (id)
);

create trigger base_swiper_upt before
update on base_swiper for each row execute procedure update_timestamp_func();
select setval('base_swiper_id_seq', 100000, false);



-- -----------------------------------
-- Table structure for biz_prod
-- -----------------------------------
CREATE TABLE public.biz_prod (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL,
    "admin_id" int8 NULL,
    "category_id" int8 NULL,
    "pic" varchar(80)  NULL,
    "name" varchar(80)  NULL,
    "origin_price" decimal(8,2)  NULL DEFAULT 0,
    "actual_price" decimal(8,2)  NULL DEFAULT 0,
    "title" varchar(80)  NULL,
    "content" text NULL,
    "imgs" text[] NULL,
    "sold_count" int8 NULL DEFAULT 0,
    "total_stock" int8 NULL DEFAULT 0,
    "remarks" varchar(200) NULL,
    CONSTRAINT biz_prod_pk PRIMARY KEY (id)
);

create trigger biz_prod_upt before
update on biz_prod for each row execute procedure update_timestamp_func();
select setval('biz_prod_id_seq', 100000, false);


-- -----------------------------------
-- Table structure for biz_prod_comm
-- -----------------------------------
CREATE TABLE public.biz_prod_comm (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "admin_id" int8 NULL,
    "user_id" int8 NULL,
    "order_id" int8 NULL,
    "order_item_id" int8 NULL,
    "prod_id" int8 NULL,
    "content" text NULL,
    "imgs" text[] NULL,
    "score" int2 NULL DEFAULT 5,
    "level" int2 NULL DEFAULT 3,
    "reply" text NULL,
    "reply_at" timestamp with time zone  NULL,
    "reply_status" int2 NOT NULL DEFAULT 1,
    "remarks" varchar(200) NULL,
    CONSTRAINT biz_prod_comm_pk PRIMARY KEY (id)
);

create trigger biz_prod_comm_upt before
update on biz_prod_comm for each row execute procedure update_timestamp_func();
select setval('biz_prod_comm_id_seq', 100000, false);

-- -----------------------------------
-- Table structure for biz_prod_props
-- -----------------------------------
CREATE TABLE public.biz_prod_props (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "prod_id" int8 NULL,
    "prop_name" int8 NULL,
    "prop_value" text[]  NULL,
    CONSTRAINT biz_prod_props_pk PRIMARY KEY (id)
);

create trigger biz_prod_props_upt before
update on biz_prod_props for each row execute procedure update_timestamp_func();
select setval('biz_prod_props_id_seq', 100000, false);


-- -----------------------------------
-- Table structure for biz_prod_sku
-- -----------------------------------
CREATE TABLE public.biz_prod_sku (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "prod_id" int8 NULL,
    "prop_content" varchar(200) NULL,
    "sku_name" varchar(200) NULL,
    "supplier_price" decimal(8,2)  NULL DEFAULT 0,
    "origin_price" decimal(8,2)  NULL DEFAULT 0,
    "actual_price" decimal(8,2)  NULL DEFAULT 0,
    "stocks" int8 NULL DEFAULT 0,
    "pic" varchar(80)  NULL,
    "prod_code" varchar(80)  NULL,
    "prod_bar" varchar(80)  NULL,

    CONSTRAINT biz_prod_sku_pk PRIMARY KEY (id)
);

create trigger biz_prod_sku_upt before
update on biz_prod_sku for each row execute procedure update_timestamp_func();
select setval('biz_prod_sku_id_seq', 100000, false);


-- -----------------------------------
-- Table structure for biz_order
-- -----------------------------------
CREATE TABLE public.biz_order (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "user_id" int8 NULL,
    "order_addr_id" int8 NULL,
    "order_content" text NULL, 
    "prod_count" int2 NOT NULL DEFAULT 1,   
    "origin_total" decimal(8,2)  NULL DEFAULT 0,
    "actual_total" decimal(8,2)  NULL DEFAULT 0,
    "payment_type" int2 NOT NULL DEFAULT 1,
    "payment_status" int2 NOT NULL DEFAULT 1,
    "refund_status" int2 NOT NULL DEFAULT 1,

    CONSTRAINT biz_order_pk PRIMARY KEY (id)
);

create trigger biz_order_upt before
update on biz_order for each row execute procedure update_timestamp_func();
select setval('biz_order_id_seq', 100000, false);



-- -----------------------------------
-- Table structure for biz_order_addr
-- -----------------------------------
CREATE TABLE public.biz_order_addr (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "user_id" int8 NULL,
    "order_id" int8 NULL,
    "user_addr_id" int8 NULL,
    "receiver" varchar(20)  NULL,
    "phone" varchar(20) NOT NULL,
    "providence_id" int4 NOT NULL,
    "providence" varchar(50) NULL,
    "city_id" int4 NOT NULL,
    "city" varchar(50) NULL,
    "area_id" int4 NOT NULL,
    "area" varchar(50) NULL,
    "postal" varchar(10) NULL,
    "addr" varchar(100) NULL,
    "remarks" varchar(200) NULL,

    CONSTRAINT biz_order_addr_pk PRIMARY KEY (id)
);

create trigger biz_order_addr_upt before
update on biz_order_addr for each row execute procedure update_timestamp_func();
select setval('biz_order_addr_id_seq', 100000, false);

-- -----------------------------------
-- Table structure for biz_order_item
-- -----------------------------------
CREATE TABLE public.biz_order_item (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "user_id" int8 NULL,
    "order_id" int8 NULL,
    "prod_id" int8 NULL,
    "prod_name" varchar(80) NULL,
    "sku_id" int8 NULL,
    "sku_name" varchar(200) NULL,
    "pic" varchar(80) NULL,
    "prod_count" int2 NOT NULL DEFAULT 1,
    "origin_unit_price" decimal(8,2)  NULL DEFAULT 0,
    "actual_unit_price" decimal(8,2)  NULL DEFAULT 0,
    "actual_total" decimal(8,2)  NULL DEFAULT 0,
    "comment_status" int2 NOT NULL DEFAULT 1,

    CONSTRAINT biz_order_item_pk PRIMARY KEY (id)
);

create trigger biz_order_item_upt before
update on biz_order_item for each row execute procedure update_timestamp_func();
select setval('biz_order_item_id_seq', 100000, false);


-- -----------------------------------
-- Table structure for biz_order_refund
-- -----------------------------------
CREATE TABLE public.biz_order_refund (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "handel_at" timestamp with time zone NULL ,
    "dvy_at" timestamp with time zone NULL ,
    "status" int2 NOT NULL DEFAULT 1,
    "user_id" int8 NULL,
    "order_id" int8 NULL,
    "order_item_id" int8 NOT NULL DEFAULT 0  ,
    "order_actual_total" decimal(8,2)  NULL DEFAULT 0,
    "refund_type" int2 NOT NULL DEFAULT 1  ,
    "refund_imgs" text[] NULL  ,
    "refund_prod_count" int2 NOT NULL DEFAULT 0  ,
    "refund_apply" varchar(200) NULL ,
    "refund_apply_total" decimal(8,2)  NULL DEFAULT 0,
    "refund_actual_total" decimal(8,2)  NULL DEFAULT 0,
    "refund_payment_status" int2  NULL DEFAULT 1,
    "refund_dvy_status" int2  NULL DEFAULT 1,
    "dvy_name" varchar(80) NULL,
    "dvy_no" varchar(80) NULL,
    "remark" varchar(200) NULL,

    CONSTRAINT biz_order_refund_pk PRIMARY KEY (id)
);

-- Column comments
COMMENT ON COLUMN public.biz_order_refund.status IS '处理状态:1为待审核,2为同意,3为不同意';
COMMENT ON COLUMN public.biz_order_refund.order_item_id IS '订单项ID 全部退款是0';
COMMENT ON COLUMN public.biz_order_refund.refund_type IS '申请类型:1,仅退款,2退款退货';
COMMENT ON COLUMN public.biz_order_refund.refund_payment_status IS '1:退款处理中 3:退款成功 2:退款失败';
COMMENT ON COLUMN public.biz_order_refund.refund_dvy_status IS '1:未发货 2:已发货 3:已收货';


create trigger biz_order_refund_upt before
update on biz_order_refund for each row execute procedure update_timestamp_func();
select setval('biz_order_refund_id_seq', 100000, false);



-- -----------------------------------
-- Table structure for biz_order_payment
-- -----------------------------------
CREATE TABLE public.biz_order_payment (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "user_id" int8 NULL,
    "order_id" int8 NULL,
    "payment_type" int2 NOT NULL,
    "serial" varchar(100) NULL, 
    "biz_serial" varchar(100) NULL, 
    "payment_amount" decimal(8,2)  NULL DEFAULT 0,
    "pid" int8  NULL DEFAULT 0,
    "income" int2  NOT NULL DEFAULT 1,
    "remark" varchar(200) NULL,  

    CONSTRAINT biz_order_payment_pk PRIMARY KEY (id)
);

create trigger biz_order_payment_upt before
update on biz_order_payment for each row execute procedure update_timestamp_func();
select setval('biz_order_payment_id_seq', 100000, false);


-- ----------------------------
-- Table structure for user_info
-- ----------------------------
CREATE TABLE public.user_info (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "last_login_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "date_id" integer NOT NULL,
    "last_login_id" integer NOT NULL,
    "phone" varchar(20) NOT NULL,
    "email" varchar(80) NULL,
    "password" varchar(100) NULL,
    "name" varchar(20) NULL,
    "nick" varchar(30) NULL,
    "avatar" varchar(200) NULL,
    "gender" int2 NULL,
    "birth" date NULL,
    "score" int8 DEFAULT 0,
    "remarks" varchar(200) NULL,
    CONSTRAINT user_info_pk PRIMARY KEY (id)
);
-- Column comments
COMMENT ON COLUMN public.user_info.gender IS '性别(1-男,0-女)';

create trigger user_info_upt before
update on user_info for each row execute procedure update_timestamp_func();
select setval('user_info_id_seq', 100000, false);

-- ------------------------------
-- Table structure for user_addr
-- ------------------------------
CREATE TABLE public.user_addr (
    "id" bigserial NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "last_login_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" int2 NOT NULL DEFAULT 1,
    "user_id" int8 NOT NULL,
    "def" int2 NOT NULL DEFAULT 0,
    "receiver" varchar(20)  NULL,
    "phone" varchar(20) NOT NULL,
    "providence_id" int4 NOT NULL,
    "providence" varchar(50) NULL,
    "city_id" int4 NOT NULL,
    "city" varchar(50) NULL,
    "area_id" int4 NOT NULL,
    "area" varchar(50) NULL,
    "postal" varchar(10) NULL,
    "addr" varchar(100) NULL,
    "remarks" varchar(200) NULL,

    CONSTRAINT user_addr_pk PRIMARY KEY (id)
);

-- Column comments
COMMENT ON COLUMN public.user_addr.def IS '性别(1-默认,0-一般)';

create trigger user_addr_upt before
update on user_addr for each row execute procedure update_timestamp_func();
select setval('user_addr_id_seq', 100000, false);