export abstract class BaseEntity<ID = string> {
  public readonly id: ID;
  public readonly createdAt: Date;
  public updatedAt: Date;

  protected constructor(props: {
    id: ID;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  touch() {
    this.updatedAt = new Date();
  }
}
