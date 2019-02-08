import { Ember } from "ember";

export default class Base  extends Ember.CoreObject { 
    public trigger(event: string, data: {}): void;
}