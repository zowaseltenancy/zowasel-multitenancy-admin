"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createProviderSchema,
  CreateProviderSchema,
} from "@/schemas/provider.schema";
import { Provider } from "@/types/provider";

interface Props {
  open: boolean;

  onClose: () => void;

  onCreate: (values: CreateProviderSchema) => void;
}

export default function AddProviderDialog({
  open,
  onClose,
  onCreate,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProviderSchema>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      category: "pay_in",
      environment: "test",
    },
  });

  const category = watch("category");

  const submit = handleSubmit((values) => {
    onCreate(values);
    reset();
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add Provider
          </DialogTitle>

          <DialogDescription>
            Connect a new pay-in, pay-out or currency provider to the platform.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Provider Name
            </label>

            <Input
              {...register("name")}
              placeholder="e.g. Chipper Cash"
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Input
              {...register("description")}
              placeholder="What does this provider do?"
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <Select
                value={category}
                onValueChange={(value) =>
                  setValue(
                    "category",
                    value as Provider["category"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="pay_in">
                    Pay-in
                  </SelectItem>

                  <SelectItem value="pay_out">
                    Pay-out
                  </SelectItem>

                  <SelectItem value="currency">
                    Currency
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Environment
              </label>

              <Select
                defaultValue="test"
                onValueChange={(value) =>
                  setValue(
                    "environment",
                    value as "test" | "live"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="test">
                    Test
                  </SelectItem>

                  <SelectItem value="live">
                    Live
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Supported Currencies
            </label>

            <Input
              {...register("supportedCurrencies")}
              placeholder="NGN, USD, GHS"
            />

            {errors.supportedCurrencies && (
              <p className="text-sm text-destructive">
                {errors.supportedCurrencies.message}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium">
              API Credentials
            </p>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Public Key
              </label>

              <Input
                {...register("publicKey")}
                placeholder="pk_test_..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Secret Key
              </label>

              <Input
                {...register("secretKey")}
                type="password"
                placeholder="sk_test_..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Webhook Secret
              </label>

              <Input
                {...register("webhookSecret")}
                type="password"
                placeholder="whsec_..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                API Key (if applicable)
              </label>

              <Input
                {...register("apiKey")}
                type="password"
                placeholder="Used by some pay-in/pay-out providers instead of key pairs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>

            <Button type="submit">
              Add Provider
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
