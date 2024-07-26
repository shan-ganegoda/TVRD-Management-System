package com.content.security.report.entity;

public class ProductCount{

        private long product1count;
        private long product2count;

        public ProductCount(long product1count, long product2count) {
            this.product1count = product1count;
            this.product2count = product2count;
        }

        public void add(long product1count, long product2count) {
            this.product1count += product1count;
            this.product2count += product2count;
        }

        public long getProduct1count() {
            return product1count;
        }

        public long getProduct2count() {
            return product2count;
        }
}
